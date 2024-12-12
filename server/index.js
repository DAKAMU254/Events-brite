import { prisma } from "./prisma.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import multer from "multer";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";
import { MongoClient, GridFSBucket } from "mongodb";
dotenv.config();

const requiredEnvVars = ["DATABASE_URL", "MONGODB_URI", "CORS_ORIGIN"];

for (const envVar of requiredEnvVars) {
	if (!process.env[envVar]) {
		throw new Error(`Missing required environment variable: ${envVar}`);
	}

	console.log(`${envVar}: ${process.env[envVar]}`);
}

const logger = winston.createLogger({
	// level: "info",
	format: winston.format.combine(
		winston.format.timestamp(),
		winston.format.json()
	),
	transports: [
		new winston.transports.File({ filename: "error.log", level: "error" }),
		new winston.transports.File({ filename: "combined.log" }),
	],
});

if (process.env.NODE_ENV !== "production") {
	logger.add(
		new winston.transports.Console({
			format: winston.format.simple(),
		})
	);
}

const app = express();
app.use(express.json());

app.use(helmet());
app.use(morgan("combined"));

app.use(
	cors({
		origin: [process.env.CORS_ORIGIN],
		credentials: true,
		methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
		allowedHeaders: ["Content-Type", "Authorization"],
	})
);

app.options("*", cors());

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

let bucket;
const connectDB = async () => {
	try {
		const client = await MongoClient.connect(process.env.MONGODB_URI);
		const db = client.db();
		bucket = new GridFSBucket(db);
		console.log("Connected to MongoDB");
	} catch (error) {
		console.error("MongoDB connection error:", error);
		process.exit(1);
	}
};

app.post("/upload", upload.single("image"), async (req, res) => {
	try {
		if (!req.file) {
			return res.status(400).json({ error: "No file uploaded" });
		}

		const date = new Date().toISOString().slice(0, 10).replace(/-/g, "");
		const originalName = req.file.originalname;
		const filename = `${date}-${originalName}`;

		const uploadStream = bucket.openUploadStream(filename, {
			contentType: req.file.mimetype,
		});

		uploadStream.end(req.file.buffer);

		await new Promise((resolve, reject) => {
			uploadStream.on("finish", resolve);
			uploadStream.on("error", reject);
		});
		console.log(`
	Image uploaded: ${filename}
	Image URL: http://localhost:8000/image/${filename}
		`);
		res.json({
			filename: filename,
			url: `http://localhost:8000/image/${filename}`,
		});
	} catch (error) {
		console.error("Upload error:", error);
		res.status(500).json({ error: "Upload failed" });
	}
});
app.get("/image/:name", async (req, res) => {
	try {
		const filename = req.params.name;

		const files = await bucket.find({ filename: filename }).toArray();

		if (!files.length) {
			return res.status(404).json({ error: "Image not found" });
		}

		res.set("Access-Control-Allow-Origin", process.env.CORS_ORIGIN);
		res.set("Cross-Origin-Resource-Policy", "cross-origin");
		res.set(
			"Access-Control-Allow-Headers",
			"Origin, X-Requested-With, Content-Type, Accept"
		);
		res.set("Access-Control-Allow-Methods", "GET, OPTIONS");
		res.set("Content-Type", files[0].contentType);

		const downloadStream = bucket.openDownloadStreamByName(filename);

		downloadStream.pipe(res);

		downloadStream.on("error", (error) => {
			console.error("Download error:", error);
			res.status(500).json({ error: "Download failed" });
		});
	} catch (error) {
		console.error("Retrieval error:", error);
		res.status(500).json({ error: "Retrieval failed" });
	}
});

app.get("/health", (req, res) => {
	res.status(200).json({ status: "healthy" });
});

app.post("/register", async (req, res) => {
	console.log(req.body);
	try {
		const existingUser = await prisma.user.findUnique({
			where: { email: req.body.email },
		});

		if (existingUser) {
			return res.status(400).json({ error: "User already exists" });
		}

		const user = await prisma.user.create({
			data: {
				name: req.body.name,
				email: req.body.email,
				image: req.body.image,
				clerkId: req.body.clerkId,
			},
		});

		return res.status(200).json(user);
	} catch (error) {
		console.error("Registration error:", error);
		return res.status(500).json({ error: "Failed to register user" });
	}
});

app.get("/events", async (req, res) => {
	try {
		const events = await prisma.event.findMany();
		res.status(200).json({ events });
	} catch (error) {
		res.status(500).json({ error: "Error fetching events." });
	}
});

app.get("/events/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const event = await prisma.event.findUnique({
			where: { id: parseInt(id) },
		});
		if (!event) {
			return res.status(404).json({ error: "Event not found." });
		}
		res.status(200).json({ event });
	} catch (error) {
		res.status(500).json({ error: "Error fetching event." });
	}
});

app.post("/events", async (req, res) => {
	console.log(req.body);
	try {
		const event = await prisma.event.create({
			data: {
				title: req.body.title,
				description: req.body.description,
				image: req.body.imageUrl,
				user: { connect: { clerkId: req.body.userId } },
			},
		});
		res.status(201).json({ event });
	} catch (error) {
		console.error("Error creating event:", error);
		res.status(500).json({ error: "Error creating event." });
	}
});

app.put("/events/:id", async (req, res) => {
	const { id } = req.params;
	const { title, description, imageUrl } = req.body;
	try {
		const event = await prisma.event.findUnique({
			where: { id: parseInt(id) },
		});
		if (!event) {
			return res.status(404).json({ error: "Event not found." });
		}
		if (event.createdBy !== req.user.id) {
			return res.status(403).json({
				error: "You are not authorized to update this event.",
			});
		}

		const updatedEvent = await prisma.event.update({
			where: { id: parseInt(id) },
			data: { title, description, imageUrl },
		});
		res.status(200).json({ updatedEvent });
	} catch (error) {
		res.status(500).json({ error: "Error updating event." });
	}
});

app.delete("/events/:id", async (req, res) => {
	const { id } = req.params;
	try {
		const event = await prisma.event.findUnique({
			where: { id: parseInt(id) },
		});
		if (!event) {
			return res.status(404).json({ error: "Event not found." });
		}
		if (event.createdBy !== req.user.id) {
			return res.status(403).json({
				error: "You are not authorized to delete this event.",
			});
		}

		await prisma.event.delete({ where: { id: parseInt(id) } });
		res.status(200).json({ message: "Event deleted successfully." });
	} catch (error) {
		res.status(500).json({ error: "Error deleting event." });
	}
});

app.use((err, req, res, next) => {
	logger.error("Unhandled error:", err);
	res.status(500).json({ error: "Internal server error" });
});

const gracefulShutdown = (signal) => {
	logger.info(`${signal} received. Starting graceful shutdown...`);

	server.close(() => {
		logger.info("HTTP server closed");

		prisma
			.$disconnect()
			.then(() => {
				logger.info("Database connection closed");
				process.exit(0);
			})
			.catch((err) => {
				logger.error("Error during database disconnection:", err);
				process.exit(1);
			});
	});
};

const server = app.listen(process.env.PORT || 8000, async () => {
	await connectDB();
	logger.info(`Server started on port ${process.env.PORT || 8000}`);
});

process.on("SIGTERM", () => gracefulShutdown("SIGTERM"));
process.on("SIGINT", () => gracefulShutdown("SIGINT"));

process.on("uncaughtException", (error) => {
	logger.error("Uncaught Exception:", error);
	gracefulShutdown("Uncaught Exception");
});

process.on("unhandledRejection", (reason, promise) => {
	logger.error("Unhandled Rejection at:", promise, "reason:", reason);
	gracefulShutdown("Unhandled Rejection");
});

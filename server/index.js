import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import multer from "multer";
import cookieParser from "cookie-parser";
import { sendVerificationCode } from "./emailVerification.js";
import { v2 as cloudinary } from "cloudinary";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import morgan from "morgan";
import winston from "winston";

dotenv.config();

const requiredEnvVars = [
  "CLOUDINARY_API_KEY",
  "CLOUDINARY_API_SECRET",
  "CLOUDINARY_CLOUD_NAME",
  "CORS_ORIGIN",
];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    throw new Error(`Missing required environment variable: ${envVar}`);
  }
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

app.use(helmet());
app.use(morgan("combined"));

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
});


cloudinary.config({
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
});

// app.set("trust proxy", true);
app.use(
  cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true,
  })
);
app.use(express.json({ limit: "1mb" }));
app.use(cookieParser());
app.use(limiter);

app.get("/health", (req, res) => {
  res.status(200).json({ status: "healthy" });
});

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 5 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) {
      return cb(new Error("Only images are allowed"));
    }
    cb(null, true);
  },
});

const uploadToCloudinary = (buffer, options) => {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        ...options,
        timeout: 10000,
      },
      (error, result) => {
        if (error) reject(error);
        else resolve(result);
      }
    );

    uploadStream.end(buffer);

    uploadStream.on("error", reject);
  });
};

app.post("/upload", upload.single("image"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }

    const maxRetries = 3;
    const retryDelay = 1000;

    let lastError;

    for (let attempt = 0; attempt < maxRetries; attempt++) {
      try {
        const uploadResult = await uploadToCloudinary(req.file.buffer, {
          folder: "dantek",
          public_id: `${Date.now()}-${req.file.originalname}`,
          resource_type: "image",
        });

        return res.status(200).json({
          url: uploadResult.secure_url,
          public_id: uploadResult.public_id,
        });
      } catch (error) {
        lastError = error;
        console.error(`Upload attempt ${attempt + 1} failed:`, error);

        if (attempt < maxRetries - 1) {
          await new Promise((resolve) => setTimeout(resolve, retryDelay));
        }
      }
    }

    throw lastError || new Error("Upload failed after all retries");
  } catch (error) {
    console.error("Upload error:", error);

    if (error.message === "Only images are allowed") {
      return res.status(400).json({ error: "Only image files are allowed" });
    }
    if (error.message === "File too large") {
      return res.status(400).json({ error: "File size exceeds 5MB limit" });
    }
    if (error.code === "ETIMEDOUT" || error.code === "ECONNRESET") {
      return res
        .status(503)
        .json({ error: "Upload service temporarily unavailable" });
    }

    res
      .status(500)
      .json({ error: "Failed to upload image. Please try again." });
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

app.post("/events", authenticateToken, async (req, res) => {
  const { title, description, imageUrl } = req.body;
  console.log(req);
  try {
    const event = await prisma.event.create({
      data: {
        title,
        description,
        imageUrl,
        userId: req.user.id,
      },
    });
    res.status(201).json({ event });
  } catch (error) {
    res.status(500).json({ error: "Error creating event." });
  }
});

app.put("/events/:id", authenticateToken, async (req, res) => {
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
      return res
        .status(403)
        .json({ error: "You are not authorized to update this event." });
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
      return res
        .status(403)
        .json({ error: "You are not authorized to delete this event." });
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

  
  const server = app.listen(process.env.PORT || 8000, () => {
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

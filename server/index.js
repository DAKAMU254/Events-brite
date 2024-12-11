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
  "JWT_SECRET",
  "JWT_REFRESH_SECRET",
  "JWT_EXPIRATION",
  "JWT_REFRESH_EXPIRATION",
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

const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
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

const generateTokens = (userId) => {
  try {
    const accessToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, {
      expiresIn: 15 * 60,
    });
    const refreshToken = jwt.sign(
      { id: userId },
      process.env.JWT_REFRESH_SECRET,
      {
        expiresIn: 15 * 24 * 60 * 60,
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    logger.error("Token generation failed:", error);
    throw new Error("Authentication service unavailable");
  }
};

const authenticateToken = (req, res, next) => {
  try {
    // const token = req.headers["authorization"]?.split(" ")[1];
    if (!token) {
      return res.status(401).json({ error: "Authentication required" });
    }

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    logger.warn("Authentication failed:", { error: err.message });
    res.status(403).json({ error: "Authentication failed" });
  }
};

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
    const user = await prisma.user.findUnique({ where: { id: decoded.id } });

    if (!user) {
      return res.status(401).json({ error: "Authentication failed" });
    }

    const tokens = generateTokens(user.id);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(15 * 24 * 60 * 60) * 1000,
    });

    res.status(200).json({ accessToken: tokens.accessToken });
  } catch (err) {
    logger.error("Token refresh failed:", err);
    res.status(403).json({ error: "Authentication failed" });
  }
});

app.post("/register", async (req, res) => {
  try {
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    const user = await prisma.user.create({
      data: {
        name: req.body.name,
        email: req.body.email,
        emailVerified: null,
        password: await bcrypt.hash(req.body.password, 12),
        verificationToken: verificationCode,
      },
    });

    await sendVerificationCode(user.email, verificationCode);
    const tokens = generateTokens(user.id);

    res.cookie("refreshToken", tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(15 * 24 * 60 * 60) * 1000,
    });
    res.cookie("user", JSON.stringify(user), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.status(201).json({
      message: "Registration successful",
      accessToken: tokens.accessToken,
    });
  } catch (error) {
    logger.error("Registration failed:", error);
    res.status(500).json({ error: "Registration failed" });
  }
});

app.post("/verify", async (req, res) => {
  const { email, code } = req.body;
  try {
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }
    if (user.verificationToken !== parseInt(code)) {
      return res.status(400).json({ error: "Invalid verification code." });
    }

    await prisma.user.update({
      where: { email },
      data: {
        emailVerified: new Date(),
        verificationToken: null,
      },
    });

    res.status(200).json({ message: "Email verified successfully." });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!user && !isPasswordValid) {
      return res.status(404).json({ error: "User not found." });
    }

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge:(15 * 24 * 60 * 60) * 1000,
    });

    res.status(200).json({
      message: "Login successful.",
      user,
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
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

app.post("logout", authenticateToken,async (res,req) => {

})

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

app.delete("/events/:id", authenticateToken, async (req, res) => {
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

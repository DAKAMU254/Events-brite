import jwt from "jsonwebtoken";
import { prisma } from "./prisma.js";
import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import bcrypt from "bcryptjs";
import multer from "multer";
import cookieParser from "cookie-parser";
import { sendVerificationCode } from "./emailVerification.js";

dotenv.config();

const app = express();
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.set("trust proxy", true);
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

const {
  JWT_SECRET,
  JWT_REFRESH_SECRET,
  JWT_EXPIRATION,
  JWT_REFRESH_EXPIRATION,
} = process.env;

const generateTokens = (userId) => {
  const accessToken = jwt.sign({ id: userId }, JWT_SECRET, {
    expiresIn: JWT_EXPIRATION,
  });
  const refreshToken = jwt.sign({ id: userId }, JWT_REFRESH_SECRET, {
    expiresIn: JWT_REFRESH_EXPIRATION,
  });
  return { accessToken, refreshToken };
};

/* 
Middleware. --> incase ukue na any other routes you want to add
hii ndio ya ku-ensure users are authenticated before perfroming any actions
*/
const authenticateToken = (req, res, next) => {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token)
    return res.status(401).json({ error: "Access denied. No token provided." });

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired access token." });
  }
};

app.post("/refresh", async (req, res) => {
  const { refreshToken } = req.body;

  if (!refreshToken) {
    return res.status(401).json({ error: "No refresh token provided." });
  }

  try {
    const decoded = jwt.verify(refreshToken, JWT_REFRESH_SECRET);

    const user = await prisma.user.findUnique({ where: { id: decoded.id } });
    if (!user) {
      return res.status(404).json({ error: "User not found." });
    }

    const { accessToken, refreshToken: newRefreshToken } = generateTokens(
      user.id
    );

    res.cookie("refreshToken", newRefreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(JWT_REFRESH_EXPIRATION) * 1000,
    });

    res.status(200).json({ accessToken });
  } catch (err) {
    res.status(403).json({ error: "Invalid or expired refresh token." });
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
        password: bcrypt.hashSync(req.body.password),
        // image:
        //   req.body.image ||
        //   "https://cdn-icons-png.flaticon.com/128/64/64572.png",
        verificationToken: verificationCode,
      },
    });
    console.log(user);

    await sendVerificationCode(user.email, verificationCode);

    const { accessToken, refreshToken } = generateTokens(user.id);

    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: parseInt(JWT_REFRESH_EXPIRATION) * 1000,
    });

    res.status(201).json({
      message: "User registered successfully. Please verify your email.",
      accessToken,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
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
      maxAge: parseInt(JWT_REFRESH_EXPIRATION) * 1000,
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



// app.post(
//   "/upload-image",
//   upload.single("image"), // Accepts the image file as 'image'
//   async (req, res) => {
//     try {
//       // Check if the file is uploaded
//       if (!req.file) {
//         return res.status(400).json({ error: "No file uploaded" });
//       }

//       // The uploaded file is in `req.file.buffer`, which is a Buffer containing the image data
//       const imageBuffer = req.file.buffer;

//       // Update the user record with the image buffer in the database
//       const updatedUser = await prisma.user.update({
//         where: { id: req.user.id }, // Ensure that req.user.id is set correctly (e.g., via authentication)
//         data: {
//           image: imageBuffer, // Store the buffer in the 'image' field (make sure this is a `Bytes` field in Prisma)
//         },
//       });

//       // Respond with the updated user info (you can include the image URL if needed)
//       res.status(200).json({
//         message: "Image uploaded successfully",
//         user: updatedUser, // This includes the updated user object, including the image buffer
//       });
//     } catch (error) {
//       console.error(error);
//       res.status(500).json({ error: "Failed to upload image" });
//     }
//   }
// );


app.listen(8000, () => {
  console.log("Server started on port 8000");
});

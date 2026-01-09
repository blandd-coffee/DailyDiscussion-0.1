/*
________         .__.__          ________  .__                                  .__
\______ \ _____  |__|  | ___.__. \______ \ |__| ______ ____  __ __  ______ _____|__| ____   ____
 |    |  \\__  \ |  |  |<   |  |  |    |  \|  |/  ___// ___\|  |  \/  ___//  ___/  |/  _ \ /    \
 |    `   \/ __ \|  |  |_\___  |  |    `   \  |\___ \\  \___|  |  /\___ \ \___ \|  (  <_> )   |  \
/_______  (____  /__|____/ ____| /_______  /__/____  >\___  >____//____  >____  >__|\____/|___|  /
        \/     \/        \/              \/        \/     \/           \/     \/               \/
*/

import "dotenv/config";

import path from "path";
import { fileURLToPath } from "url";

import express from "express";
import session from "express-session";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import compression from "compression";
import Joi from "joi";

import userRoutes from "./src/routes/user.routes.js";
import discussionRoutes from "./src/routes/discussion.routes.js";
import responseRoutes from "./src/routes/response.routes.js";
import authRoutes from "./src/routes/auth.routes.js";
import requireAuth from "./src/middleware/auth.js";
import { CreateAdminAuth } from "./src/middleware/isAdmin.js";
import logger from "./src/utility/logger.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Environment variable validation
const envSchema = Joi.object({
  SESSION_SECRET: Joi.string().required(),
  PORT: Joi.number().optional(),
  NODE_ENV: Joi.string().optional(),
}).unknown(true);

const { error } = envSchema.validate(process.env);
if (error) {
  console.error(
    "Environment variable validation failed:",
    error.details[0].message
  );
  process.exit(1);
}

const app = express();
const PORT = process.env.PORT || 8080;

// Security middleware with relaxed CSP for Bootstrap CDN and inline scripts
app.use(
  helmet({
    contentSecurityPolicy: {
      useDefaults: true,
      directives: {
        "script-src": ["'self'", "https://cdn.jsdelivr.net", "'unsafe-inline'"],
        // You can add other directives as needed
      },
    },
  })
);

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: "Too many requests from this IP, please try again later.",
});
app.use(limiter);

// Compression
app.use(compression());

// Trust proxy for production (behind load balancer)
if (process.env.NODE_ENV === "production") {
  app.set("trust proxy", 1);
}

// HTTPS enforcement in production
if (process.env.NODE_ENV === "production") {
  app.use((req, res, next) => {
    if (req.header("x-forwarded-proto") !== "https") {
      res.redirect(`https://${req.header("host")}${req.url}`);
    } else {
      next();
    }
  });
}

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: process.env.NODE_ENV === "production",
    },
  })
);

// Express config
app.use(express.urlencoded({ extended: false }));
app.use(express.json());
app.use(cors());

// Auth routes and middleware
app.use("/auth", authRoutes);

// Health check endpoint
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

// API Routes (public read access, auth required for mutations)
app.use("/api/discussions", discussionRoutes);
app.use("/api/users", userRoutes);
app.use("/api/responses", responseRoutes);

// Require auth for all other routes
app.use(requireAuth);

// Serve static assets (CSS, JS, images, etc.) for both apps
app.use(express.static(path.join(__dirname, "public")));

// Admin Dashboard - require auth then check admin flag in DB
const adminAuth = CreateAdminAuth(__dirname);
app.get(/^\/admin/, requireAuth, adminAuth);

// User App - served at root
app.get(/.*/, (req, res) => {
  logger.info("User app route accessed");
  res.sendFile(path.join(__dirname, "public/client/index.html"));
});

// Centralized error handling
app.use((err, req, res, next) => {
  logger.error("Unhandled error:", err);
  res.status(500).json({ error: "Internal Server Error" });
});

// Graceful shutdown
process.on("SIGTERM", () => {
  logger.info("SIGTERM received, shutting down gracefully");
  app.close(() => {
    logger.info("Process terminated");
  });
});

app.listen(PORT, () => {
  logger.info(`Server running on port ${PORT}`);
});

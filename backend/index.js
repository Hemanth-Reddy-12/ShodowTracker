import "./polyfill.js";
import express from "express";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import { prisma } from "./lib/prisma.js";

import { toNodeHandler } from "better-auth/node";
import { auth } from "./lib/auth.js";

dotenv.config();
const app = express();
app.use(cookieParser());

// Update CORS configuration
const allowedOrigins = [
  "http://localhost:5173",
  "https://shadow-tracker.vercel.app", // Add your Vercel domain here
  process.env.FRONTEND_URL, // Optional: use an environment variable
];

app.use(
  cors({
    origin: function (origin, callback) {
      // Allow requests with no origin (like mobile apps, curl requests)
      if (!origin) return callback(null, true);
      if (allowedOrigins.indexOf(origin) === -1) {
        const msg =
          "The CORS policy for this site does not allow access from the specified Origin.";
        return callback(new Error(msg), false);
      }
      return callback(null, true);
    },
    credentials: true,
  })
);

app.all("/api/auth/*splat", toNodeHandler(auth));
app.use(express.json());

app.use("/api", router);

// Add error handling for Vercel serverless functions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status: false, msg: "Something broke!" });
});

// Initialize DB connection for Vercel environment
const initDbConnection = async () => {
  try {
    await prisma.$connect();
    console.log("Database connected successfully via Prisma");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

// Call database initialization
initDbConnection();

// Root endpoint with DB connection status
app.get("/", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      message: "API is running... Welcome to Shadow Tracker API!",
      databaseStatus: "Connected",
      isConnected: true,
      environment: process.env.NODE_ENV || "development",
    });
  } catch (error) {
    res.json({
      message: "API is running... Welcome to Shadow Tracker API!",
      databaseStatus: "Disconnected",
      isConnected: false,
      environment: process.env.NODE_ENV || "development",
    });
  }
});

// Add DB status endpoint
app.get("/api/status", async (req, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    res.json({
      database: {
        status: "connected",
        state: 1,
      },
      api: "running",
      timestamp: new Date(),
    });
  } catch (error) {
    res.json({
      database: {
        status: "disconnected",
        state: 0,
      },
      api: "running",
      timestamp: new Date(),
    });
  }
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

// Export for Vercel
export default app;

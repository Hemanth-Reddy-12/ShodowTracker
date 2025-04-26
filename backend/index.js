import express from "express";
import { dbConfig } from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import mongoose from "mongoose";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());

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

app.use("/api", router);

// Add error handling for Vercel serverless functions
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send({ status: false, msg: "Something broke!" });
});

// Initialize DB connection for Vercel environment
const initDbConnection = async () => {
  try {
    await dbConfig();
    console.log("Database connected successfully");
  } catch (error) {
    console.error("Database connection failed:", error.message);
  }
};

// Call database initialization
initDbConnection();

// Root endpoint with DB connection status
app.get("/", (req, res) => {
  const dbStatus = mongoose.connection.readyState;

  // Mongoose connection states: 0 = disconnected, 1 = connected, 2 = connecting, 3 = disconnecting
  const connectionStatus = {
    0: "Disconnected",
    1: "Connected",
    2: "Connecting",
    3: "Disconnecting",
  };

  res.json({
    message: "API is running... Welcome to Shadow Tracker API!",
    databaseStatus: connectionStatus[dbStatus] || "Unknown",
    isConnected: dbStatus === 1,
    environment: process.env.NODE_ENV || "development",
  });
});

// Add DB status endpoint
app.get("/api/status", (req, res) => {
  const dbStatus = mongoose.connection.readyState;
  res.json({
    database: {
      status: dbStatus === 1 ? "connected" : "disconnected",
      state: dbStatus,
    },
    api: "running",
    timestamp: new Date(),
  });
});

// For local development
if (process.env.NODE_ENV !== "production") {
  app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });
}

// Export for Vercel
export default app;

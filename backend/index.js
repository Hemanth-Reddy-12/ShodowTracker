import express from "express";
import { dbConfig } from "./config/db.js";
import dotenv from "dotenv";
import router from "./routes/route.js";
import cookieParser from "cookie-parser";
import cors from "cors";

dotenv.config();
const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(cors({ origin: "http://localhost:5173", credentials: true }));

app.use("/api", router);

app.listen(3000, () => {
  dbConfig();
  console.log("Server is running on port 3000");
});

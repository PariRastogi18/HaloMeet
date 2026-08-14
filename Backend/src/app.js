import dotenv from "dotenv";
dotenv.config();
import http from "http";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import { connectToSocket } from "./controllers/socketManager.js";
import { connectDB } from "./config/database.js";
import cookieParser from "cookie-parser";
import passport from "passport";
import authRouter from "./routes/auth.routes.js";
import "./config/passport.js";

const app = express();
const server = http.createServer(app);
const io = connectToSocket(server);

app.set("trust proxy", 1);
app.set("port", process.env.PORT || 5000);
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    methods: ["GET", "POST", "PATCH", "DELETE"],
    credentials: true,
  }),
);

app.use(express.json({ limit: "40kb" }));
app.use(express.urlencoded({ limit: "40kb", extended: "true" }));
app.use(cookieParser());
app.use(passport.initialize());
app.use("/api/auth", authRouter);

const PORT = process.env.PORT;

connectDB();
const start = async () => {
  server.listen(PORT, () => {
    console.log("Server listing on port 5000");
  });
};

start();

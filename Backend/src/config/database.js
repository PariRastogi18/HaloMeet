import { config } from "./config.js";
import mongoose from "mongoose";

export async function connectDB() {
  await mongoose.connect(config.MONGODB_URI);
  console.log("Connected successfully to db");
}

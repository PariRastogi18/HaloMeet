import dotenv from "dotenv";
dotenv.config();

if (!process.env.MONGODB_URI) {
  console.log("MONGODB_URI is not defined in environment variable");
}

export const config = {
  MONGODB_URI: process.env.MONGODB_URI,
  JWT_SECRET: process.env.JWT_SECRET,
};

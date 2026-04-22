import { config } from "dotenv";

if (process.env.NODE_ENV !== "production") {
  config({
    path: "./src/config/env/.env.development",
  });
}

export const {
  MONGO_URI,
  JWT_SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
} = process.env;

export const ALLOWED_PATHS =
  process.env.NODE_ENV === "production"
    ? true
    : ["http://localhost:3000", "http://localhost:3001"];

export default {
  MONGO_URI,
  JWT_SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  ALLOWED_PATHS,
};

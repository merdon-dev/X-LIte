import { config } from "dotenv";

config({
  path: `./src/config/env/.env.${process.env.NODE_ENV || "development"}`,
});

export const {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
} = process.env;

export const ALLOWED_PATHS = ["http://localhost:3000", "http://localhost:3001"];

export default {
  PORT,
  MONGO_URI,
  JWT_SECRET,
  NODE_ENV,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  ALLOWED_PATHS,
};

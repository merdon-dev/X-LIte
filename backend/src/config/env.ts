import { config } from "dotenv";

config();

export const {
  MONGO_URI,
  JWT_SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
} = process.env;

export const ALLOWED_PATHS =
  process.env.NODE_ENV === "production"
    ? ["https://your-frontend.vercel.app"]
    : [
        "http://localhost:5173",
        "http://localhost:3000",
        "http://localhost:3001",
      ];

export default {
  MONGO_URI,
  JWT_SECRET,
  CLOUDNARY_CLOUD_NAME,
  CLOUDNARY_API_KEY,
  CLOUDNARY_API_SECRET,
  ALLOWED_PATHS,
};

import { config } from "dotenv";

config({
  path: `./src/config/env/.env.${process.env.NODE_ENV || "development"}`,
});

export const { PORT, MONGO_URI, JWT_SECRET, NODE_ENV } = process.env;

export default { PORT, MONGO_URI, JWT_SECRET, NODE_ENV };

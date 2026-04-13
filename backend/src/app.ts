import express from "express";
const app = express();
import { PORT } from "./config/env.js";
import { connectDB } from "./db/connectDB.js";
import authRouter from "./routes/auth.routes.js";

app.use(express.json());

app.use("/api/v1/auth", authRouter);

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
  });
});

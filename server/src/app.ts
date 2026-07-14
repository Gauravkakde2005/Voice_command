import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import { env } from "./config/env.js";
import { shoppingRouter } from "./routes/shoppingRoutes.js";
import { errorHandler } from "./middleware/errorHandler.js";
import { notFoundHandler } from "./middleware/notFound.js";
import dns from 'node:dns';
 dns.setServers(['8.8.8.8', '8.8.4.4']);
export const app = express();

const corsOptions =
  env.NODE_ENV === "development"
    ? { origin: true, credentials: true }
    : { origin: env.CLIENT_URL, credentials: true };

app.use(cors(corsOptions));
app.use(helmet());
app.use(express.json());
app.use(morgan("dev"));

app.get("/health", (_req, res) => {
  res.json({ success: true, message: "Server is healthy." });
});

app.use("/api", shoppingRouter);
app.use(notFoundHandler);
app.use(errorHandler);

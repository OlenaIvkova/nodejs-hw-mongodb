import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routes/contact.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import authRouter from "./routes/auth.js";
import cookieParser from "cookie-parser";
import authenticate from "./middlewares/authenticate.js";

import swaggerUi from 'swagger-ui-express';
import fs from "fs";
import path from "path";

const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3001;

  const swaggerDocument = fs.readFileSync(path.join(__dirname, "../docs/openapi.yaml"), "utf8");

  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());

  app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

  app.use("/auth", authRouter);
  app.use("/contacts", authenticate, contactsRouter);
  
  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
export default setupServer;
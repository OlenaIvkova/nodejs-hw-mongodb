import dotenv from "dotenv";
dotenv.config();

import cookieParser from "cookie-parser";
import cors from "cors";
import express from "express";
import pino from "pino-http";

import authenticate from "./middlewares/authenticate.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";
import { swaggerDocs } from "./middlewares/swaggerDocs.js";
import authRouter from "./routes/auth.js";
import contactsRouter from "./routes/contact.js";

// import path from "path";
// import swaggerUi from "swagger-ui-express";
// import YAML from "yamljs";

const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(pino({ transport: { target: 'pino-pretty' } }));
  app.use(cors());
  app.use(express.json());
  app.use(cookieParser());
  
  app.use("/api-docs", swaggerDocs());
  app.use("/auth", authRouter);
  app.use("/contacts", authenticate, contactsRouter);

  // app.use('/swagger', express.static(path.resolve('swagger')));

  // const swaggerDocument = YAML.load(path.resolve("docs/openapi.yaml"));
  // app.use(
  //   "/api-docs",
  //   swaggerUi.serve,
  //   swaggerUi.setup(swaggerDocument, { explorer: true })
  // );

  app.use((req, res) => {
    res.status(404).json({ message: "Route not found" });
  });
  app.use(notFoundHandler);
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
};
export default setupServer;
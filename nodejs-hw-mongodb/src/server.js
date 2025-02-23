import express from "express";
import cors from "cors";
import pino from "pino-http";
import contactsRouter from "./routes/contact.js";
import authRouter from "./routes/authRoutes.js"; 
import errorHandler from "./middlewares/errorHandler.js";
import notFoundHandler from "./middlewares/notFoundHandler.js";

import dotenv from 'dotenv';
dotenv.config();

console.log('MONGODB_USER:', process.env.MONGODB_USER); 
console.log('JWT_SECRET:', process.env.JWT_SECRET);
console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);

const setupServer = () => {
  const app = express();
  const PORT = process.env.PORT || 3001;

  app.use(pino({ transport: { target: "pino-pretty" } }));
  app.use(cors());
  app.use(express.json());

  app.use("/auth", authRouter);
  app.use("/contacts", contactsRouter);

  app.use(notFoundHandler); 
  app.use(errorHandler);

  app.listen(PORT, () => console.log(`🚀 Server is running on port ${PORT}`));

  // app.use((req, res) => {
  //   res.status(404).json({ message: "Route not found" });
  // });
};

export default setupServer;
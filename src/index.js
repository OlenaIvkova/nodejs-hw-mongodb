import dotenv from "dotenv";
dotenv.config();

import setupServer from './server.js';
import initMongoConnection from './db/initMongoConnection.js';

console.log("ENV Loaded:", {
  cloud: process.env.CLOUD_NAME,
  key: process.env.CLOUD_API_KEY,
  secret: process.env.CLOUD_API_SECRET ? "✅" : "❌",
});


const startApp = async () => {
  await initMongoConnection();
  setupServer();
};

export function getEnvVar(name, defaultValue) {
  const value = process.env[name];

  if (value) return value;

  if (defaultValue) return defaultValue;

  throw new Error(`Missing: process.env['${name}'].`);
}

startApp();
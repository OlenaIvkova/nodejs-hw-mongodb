import mongoose from "mongoose";

import dotenv from "dotenv";
dotenv.config();

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    
     console.log("MONGODB_USER:", MONGODB_USER);
     console.log("MONGODB_PASSWORD:", MONGODB_PASSWORD);
     console.log("MONGODB_URL:", MONGODB_URL);
     console.log("MONGODB_DB:", MONGODB_DB);
    

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error("Missing required environment variables for MongoDB");
    }

    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;
    await mongoose.connect(connectionString); 

    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default initMongoConnection;
import mongoose from "mongoose";

import dotenv from 'dotenv';
dotenv.config();

const initMongoConnection = async () => {
  try {
    const { MONGODB_USER, MONGODB_PASSWORD, MONGODB_URL, MONGODB_DB } =
      process.env;
    
    console.log('MONGODB_USER:', process.env.MONGODB_USER);
    console.log('MONGODB_PASSWORD:', process.env.MONGODB_PASSWORD);
    console.log('MONGODB_URL:', process.env.MONGODB_URL);
    console.log('MONGODB_DB:', process.env.MONGODB_DB);
    console.log('JWT_SECRET:', process.env.JWT_SECRET);
    console.log('JWT_REFRESH_SECRET:', process.env.JWT_REFRESH_SECRET);
    
    //  console.log("MONGODB_USER:", MONGODB_USER);
    //  console.log("MONGODB_PASSWORD:", MONGODB_PASSWORD);
    //  console.log("MONGODB_URL:", MONGODB_URL);
    //  console.log("MONGODB_DB:", MONGODB_DB);
    

    if (!MONGODB_USER || !MONGODB_PASSWORD || !MONGODB_URL || !MONGODB_DB) {
      throw new Error("Missing required environment variables for MongoDB");
    }

    // const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}`;
    const connectionString = `mongodb+srv://${MONGODB_USER}:${MONGODB_PASSWORD}@${MONGODB_URL}/${MONGODB_DB}?retryWrites=true&w=majority`;
    await mongoose.connect(connectionString); 

    console.log("Mongo connection successfully established!");
  } catch (error) {
    console.error("Error connecting to MongoDB:", error.message);
    process.exit(1);
  }
};

export default initMongoConnection;
import mongoose from "mongoose";

let isConnected = false; // track the connection

export async function connectDB() {
  if (isConnected) {
    console.log("MongoDB already connected");
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please add MONGO_URI to your .env.local file");
  }

  try {
    const db = await mongoose.connect(process.env.MONGO_URI, {
      dbName: "artblog",
    });

    isConnected = db.connections[0].readyState === 1;
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
  }
}

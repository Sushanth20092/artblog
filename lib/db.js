import mongoose from "mongoose";

export async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return;
  }

  if (!process.env.MONGO_URI) {
    throw new Error("Please add MONGO_URI to your .env.local file");
  }

  try {
    await mongoose.connect(process.env.MONGO_URI, {
      dbName: "artblog",
    });
    console.log("MongoDB Connected Successfully");
  } catch (error) {
    console.log("MongoDB Connection Error: ", error);
  }
}

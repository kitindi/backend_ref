import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  await mongoose.connect(process.env.MONGODB_URL).then(() => {
    console.log("DB connected");
  });
}

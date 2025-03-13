import mongoose from "mongoose";
import "dotenv/config";

export async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGODB_URL).then(() => {
      console.log("DB connected");
    });
  } catch (error) {
    handleError(error);
  }
}

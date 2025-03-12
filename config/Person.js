import mongoose from "mongoose";

const PersonSchema = new mongoose.Schema({
  name: String,
  age: Number,
  email: String,
});

// create a model

export const Person = mongoose.model("Person", PersonSchema);

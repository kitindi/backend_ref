// const express = require("express");
import "dotenv/config";
import express from "express";
import router from "./routes.js";
import multer from "multer";
import { storage } from "./config/multer.js";
import { connectDB } from "./config/db.js";
import { Person } from "./models/Person.js";

const app = express();

const port = 3000;

// connect to database
await connectDB();

const upload = multer({
  storage,
  limits: {
    fileSize: 1024000,
  },
});

// Middleware to parse JSON request bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(upload.single("image"));
app.use(cookieParser);

// decalare a middleware

app.use("/author", (req, res, next) => {
  console.log("A new request received at " + new Date().toLocaleString());
  next();
});

// define a simple route

app.use("/", router);

// saving data in mongodb
app.post("/person", async (req, res) => {
  try {
    const { name, email, age } = req.body;
    const newPreson = new Person({ name, age, email });
    await newPreson.save();
    console.log(newPreson);
    res.send("Added successfully");
  } catch (error) {
    res.send(error.message);
  }
});

// updating data in mongodb
app.put("/person/:id", async (req, res) => {
  const { age } = req.body;
  const { id } = req.params;
  const personData = await Person.findByIdAndUpdate(id, { $set: { age: age } });

  await personData.save();
  console.log(personData);
  res.send("Successfully Updated");
});
app.delete("/person/:id", async (req, res) => {
  const { id } = req.params;
  await Person.findByIdAndDelete(id);

  res.send("Successfully Deleted");
});

// app.post("/author", (req, res) => {
//   const { name } = req.body;
//   res.json({ message: `This note is written by ${name}` });
// });

// app.put("/author/:id", (req, res) => {
//   const id = req.params.id;
//   const { name } = req.body;
//   res.json({ message: `author with id ${id} is updated to ${name}` });
// });

// app.delete("/author/:id", (req, res) => {
//   const id = req.params.id;
//   res.json({ message: `User with id ${id} is successfully deleted` });
// });

// app.post("/form", (req, res) => {
//   console.log(req.body);
//   console.log(req.file);
//   res.json({ message: "Form received" });
// });
// error handlers
app.get("/error", () => {
  throw Error("This is test error!");
});

app.use((err, req, res, next) => {
  console.error(err.message);
  res.send("Internal Server Error!");
});

// listen for requests
app.listen(port, () => {
  console.log(`Server is listening on port http://localhost:${port}`);
});

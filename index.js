// const express = require("express");
import express from "express";
import router from "./routes.js";
import multer from "multer";
import { storage } from "./config/multer.js";

const app = express();
const port = 3000;
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

// decalare a middleware

app.use("/author", (req, res, next) => {
  console.log("A new request received at " + new Date().toLocaleString());
  next();
});

// define a simple route

app.use("/", router);

app.post("/author", (req, res) => {
  const { name } = req.body;
  res.json({ message: `This note is written by ${name}` });
});

app.put("/author/:id", (req, res) => {
  const id = req.params.id;
  const { name } = req.body;
  res.json({ message: `author with id ${id} is updated to ${name}` });
});

app.delete("/author/:id", (req, res) => {
  const id = req.params.id;
  res.json({ message: `User with id ${id} is successfully deleted` });
});

app.post("/form", (req, res) => {
  console.log(req.body);
  console.log(req.file);
  res.json({ message: "Form received" });
});
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

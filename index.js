// const express = require("express");
import "dotenv/config";
import express from "express";
import cookieParser from "cookie-parser";
import session from "express-session";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
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
app.use(cookieParser());
app.use(
  session({
    secret: "sample-secret",
    resave: false,
    saveUninitialized: false,
  })
);

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

const users = [];

// using session-cookie

// app.post("/register", async (req, res) => {
//   const { username, password } = req.body;
//   users.push({ username, password });
//   res.send("User registerd");
// });
// app.post("/login", async (req, res) => {
//   const { username, password } = req.body;
//   const user = users.find((user) => user.username === username);

//   if (!user | (password != user.password)) {
//     return res.send("Not Authorised user");
//   }
//   req.session.user = user;
//   res.send("User logged in");
// });

// app.get("/dash", (req, res) => {
//   if (!req.session.user) {
//     res.send("Unauthorised");
//   }
//   res.send(`Welcome ${req.session.user.username}`);
// });

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

// USE JWT FOR AUTHENTICATION

app.post("/register", async (req, res) => {
  const { username, password } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  users.push({
    username,
    password: hashedPassword,
  });

  res.send("User created!");
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const user = users.find((u) => u.username === username);

  if (!user | !(await bcrypt.compare(password, user.password))) {
    return res.send("Not authorized!");
  }
  // generate token

  const token = jwt.sign({ username: username }, "1234#secret");

  res.json({ token });
});

app.get("/dash", (req, res) => {
  try {
    const token = req.header("Authorization");
    const decoded = jwt.verify(token, "1234#secret");
    if (decoded.username) {
      res.send(`Welcome ${decoded.username}`);
    } else {
      res.send("Access denied");
    }
  } catch (error) {
    res.send("Access denied");
  }
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

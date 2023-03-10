/*
 * Run the following commands one by one
 * -------------------------------------
 * npm install
 * npm start
 */

// Importing .env file contents into process
import dotenv from "dotenv";
dotenv.config();

// Importing libraries
import express from "express";
import cors from "cors";
import engine from "ejs";

import { usersRouter } from "./routes/users.js";
import { tasksRouter } from "./routes/tasks.js";

import { createCollections } from "./database/db_methods.js";

// Initialize server application
const app = express();

// CORS configuration
app.use(cors());
app.use(
  express.json({
    type: [
      "application/json",
      "multipart/form-data",
      "application/x-www-form-urlencoded",
    ],
  })
);

// Setup for rendering html pages
app.engine("html", engine.renderFile);
app.set("views", "./public");
app.set("view engine", "ejs");
app.use(express.static("public"));

// Route to serve application
app.get("/", async (req, res) => {
  // TODO: Replace with your own html
  res.render("index.html");
});

// TODO: Delete this
app.get("/help", (req, res) => {
  res.render("instructions.html");
});

app.use("/user", usersRouter);
app.use("/task", tasksRouter);

const server = app.listen(
  Number.parseInt(process.env.PORT),
  process.env.ADDRESS,
  () => {
    console.log(
      "Server listening on http://%s:%s",
      process.env.ADDRESS,
      process.env.PORT
    );
  }
);

server.on("listening", async () => {
  const collections = await createCollections();

  if (!collections.tasks)
    console.error(
      "Failed to create tasks collection, perhaps it already exists"
    );
  else console.log("Created tasks collection");

  if (!collections.users)
    console.error(
      "Failed to create users collection, perhaps it already exists"
    );
  else console.log("Created users collection");
});

const express = require("express");
const app = express();
// To can deal with the .env varaibles
require("dotenv").config();
const mongoose = require("mongoose");
const path = require("path");
const url = process.env.MONGO_URL;
const httpStatusText = require("./utils/httpStatusText");
const cors = require("cors");
// To handle the Cross Origin Resource Sharing
app.use(cors());

app.use("/uploads", express.static(path.join(__dirname, "uploads")));

mongoose
  .connect(url)
  .then(() => {
    console.log("MongoDB Server Started");
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB:", error.message);
  });

app.use(express.json());

// Handle the Routing system with the middleware handler [use]
const COURSE_URL = "/api/courses";
const USER_URL = "/api/users";
const coursesRouter = require("./Routes/courses.route");
const usersRouter = require("./Routes/users.route");

app.use(COURSE_URL, coursesRouter);
app.use(USER_URL, usersRouter);

// handle not found URLs
app.all("*", (req, res, next) => {
  res.status(404).json({
    // ERROR
    status: httpStatusText.ERROR,
    message: "This resource is not available",
    code: 404,
  });
});

// handle erros when using the middleware to deal the controller status
app.use((error, req, res, next) => {
  res.status(error.statusCode || 500).json({
    status: error.statusText || httpStatusText.ERROR,
    message: error.message,
    data: null,
    code: error.statusCode,
  });
});

app.listen(process.env.PORT || 4000, () => {
  console.log("listenning on port 4000");
});

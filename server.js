const app = require("./app/index");
const dotenv = require("dotenv");
const chalk = require("chalk");
const mongoose = require("mongoose");
const authRoutes = require("./routes/authRoute");
const bodyParser = require("body-parser");
const userRoutes = require("./routes/userRoutes");
const express = require("express");
const cors = require("cors");
const multer = require("multer");
const forms = require("multer");
const http = require("http").Server(app);

app.use(multer().none());
const baseRoute = "/api/v1/";
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
dotenv.config();
mongoose
  .connect(process.env.MONGODB_URI, {})
  .then(() => console.log(chalk.green("Db connection Successfully")))
  .catch((err) => console.log(chalk.red(err)));

app.use("/uploads", express.static("uploads"));
app.use("/api/v1/auth", authRoutes);
app.use("/api/v1/user", userRoutes);

// io.on("connection", () => {
//     console.log("A user connected")
// })
const port = process.env.PORT || "3000";

app.listen(port, () => {
  console.log(chalk.green(`Port:localhost://${port}`));
  console.log(chalk.green(`Mode:${process.env.NODE_ENV}`));
});

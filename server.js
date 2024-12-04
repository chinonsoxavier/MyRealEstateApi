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
const { MongoClient, ServerApiVersion } = require("mongodb");
const uri = process.env.MONGODB_URI;


  // "mongodb+srv://chinonsoxavier26:edcpUT6Hr9XI007L@cluster0.n3vwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
// const client = new MongoClient(uri, {
//   serverApi: {
//     version: ServerApiVersion.v1,
//     strict: true,
//     deprecationErrors: true,
//   },
// });

// async function run() {
//   try {
//     // Connect the client to the server	(optional starting in v4.7)
//     await client.connect();
//     // Send a ping to confirm a successful connection
//     await client.db("admin").command({ ping: 1 });
//     console.log(
//       "Pinged your deployment. You successfully connected to MongoDB!"
//     );
//   } finally {
//     // Ensures that the client will close when you finish/error
//     await client.close();
//   }
// }
// run().catch(console.dir);

app.use(multer().none());
const baseRoute = "/api/v1/";
app.use(bodyParser.json());
app.use(cors());
app.use(express.json());
dotenv.config();
mongoose
  .connect(
    "mongodb+srv://chinonsoxavier26:edcpUT6Hr9XI007L@cluster0.n3vwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
    {}
  )
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

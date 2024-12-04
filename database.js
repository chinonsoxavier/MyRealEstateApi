const mongoose = require("mongoose");
const chalk = require("chalk");

module.exports = {
  connectDb: () => {
      mongoose.connect(
        process.env.MONGODBURL,
        {}
      ).then(()=>console.log(chalk.green("Db connection Successfully"))).catch((err)=>console.log(chalk.red(err)));
  },
};



const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://chinonsoxavier26:edcpUT6Hr9XI007L@cluster0.n3vwy.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    await client.close();
  }
}
run().catch(console.dir);

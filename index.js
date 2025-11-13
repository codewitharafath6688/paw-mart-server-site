const express = require("express");
const app = express();
require("dotenv").config()
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.60jbasw.mongodb.net/?appName=Cluster0`;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

app.get("/", (req, res) => {
  res.send("We are in Back-End");
});

async function run() {
  try {
    await client.connect();
    const db = client.db("paw-mart-user");
    const petCollection = db.collection("pets");
    const addCollection = db.collection("addList")

    app.get('/pets', async (req, res) => {
        const cursor = petCollection.find().limit(6);
        const result = await cursor.toArray();
        res.send(result);
    })

    app.get('/allpets', async (req, res) => {
        const cursor = petCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.post('/addList', async (req, res) => {
        const newAdd = req.body;
        const result = await addCollection.insertOne(newAdd);
        res.send(result);
    })

    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    
  }
}
run().catch(console.dir);

app.listen(port, () => {
  console.log("Back-End is active");
});

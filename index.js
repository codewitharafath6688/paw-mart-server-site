const express = require("express");
const app = express();
require("dotenv").config()
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
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

    app.get('/addList', async (req, res) => {
        const cursor = addCollection.find();
        const result = await cursor.toArray();
        res.send(result);
    })

    app.patch('/addList/:id', async (req, res) => {
        const id = req.params.id;
        const updateList = req.body;
        const query = {_id: new ObjectId(id)};
        const update = {
          $set: {
            name: updateList.name,
            image: updateList.image,
            price: updateList.price,
            location: updateList.location,
            describe: updateList.describe,
            category: updateList.category
          }
        }
        const option = {};
        const result = await addCollection.updateOne(query, update, option);
        res.json(result);
    })

    app.delete('/addList/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await addCollection.deleteOne(query);
        res.json(result);
    })

    app.get('/addList/:id', async (req, res) => {
        const id = req.params.id;
        const query = {_id: new ObjectId(id)};
        const result = await addCollection.findOne(query);
        res.json(result);
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

const express = require("express");
const app = express();
require("dotenv").config();
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
    const addCollection = db.collection("addList");
    const orderCollection = db.collection("order");

    app.get("/pets", async (req, res) => {
      const cursor = petCollection.find().limit(6);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allpets", async (req, res) => {
      const cursor = petCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.get("/allpets/:id", async (req, res) => {
      const cursor = petCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/addList", async (req, res) => {
      const newItem = req.body;
      const result =  addCollection.insertOne(newItem);
      res.send(result);
    });

    app.get("/addList", async (req, res) => {
      const cursor = addCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });

    app.patch("/addList/:id", async (req, res) => {
      const id = req.params.id;
      const updateList = req.body;
      const query = { _id: new ObjectId(id) };
      const update = {
        $set: {
          name: updateList.name,
          image: updateList.image,
          price: updateList.price,
          location: updateList.location,
          describe: updateList.describe,
          category: updateList.category,
        },
      };
      const option = {};
      const result = await addCollection.updateOne(query, update, option);
      res.send(result);
    });

    app.delete("/addList/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await addCollection.deleteOne(query);
      res.send(result);
    });

    app.get("/addList", async (req, res) => {
      const query = {};
      if (query.email) {
        query.ownerEmail = email;
      }
      const cursor = addCollection.find(query);
      const result = await cursor.toArray();
      res.send(result);
    });

    app.post("/order", async (req, res) => {
      const oderData = req.body;
      const result = await orderCollection.insertOne(oderData);
      res.send(result);
    });

    app.get("/order", async (req, res) => {
      const cursor = orderCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    })

     app.delete("/order/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await orderCollection.deleteOne(query);
      res.send(result);
    });

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

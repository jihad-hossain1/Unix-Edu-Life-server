const express = require("express");
const cors = require("cors");
const app = express();
require("dotenv").config();
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xd4auwc.mongodb.net/?retryWrites=true&w=majority`;

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
    // await client.connect();

    // all collection here
    const usersCollection = client.db("UnixEducation").collection("users");
    const userReviewCollection = client
      .db("UnixEducation")
      .collection("userReview");
    const collageCollection = client.db("UnixEducation").collection("collage");
    const enrollCollection = client.db("UnixEducation").collection("enroll");

    // users api
    app.put("/users/:email", async (req, res) => {
      const email = req.params.email;
      const user = req.body;
      const query = { email: email };
      const options = { upsert: true };
      const updateDoc = {
        $set: user,
      };
      const result = await usersCollection.updateOne(query, updateDoc, options);
      //   console.log(result);
      res.send(result);
    });
    app.get("/users", async (req, res) => {
      const result = await usersCollection.find().toArray();
      res.send(result);
    });
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await usersCollection.deleteOne(query);
      res.send(result);
    });
    app.patch("/users/admin/:id", async (req, res) => {
      const id = req.params.id;
      const filter = { _id: new ObjectId(id) };
      const updateDoc = {
        $set: {
          role: "admin",
        },
      };
      const result = await usersCollection.updateOne(filter, updateDoc);
      res.send(result);
    });
    app.put("/users/:id", async (req, res) => {
      const id = req.params.id;
      const item = req.body;
      const filter = { _id: new ObjectId(id) };
      const options = { upsert: true };
      const updateDoc = {
        $set: item,
      };
      const result = await usersCollection.updateOne(
        filter,
        updateDoc,
        options
      );
      console.log(result);
      res.send(result);
    });
    // collage collection api
    app.get("/collage", async (req, res) => {
      const result = await collageCollection.find().toArray();
      res.send(result);
    });
    // add a collage
    app.post("/addCollage", async (req, res) => {
      const doc = req.body;
      const result = await collageCollection.insertOne(doc);
      res.send(result);
    });
    // get a single collage
    app.get("/collage/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await collageCollection.findOne(query);
      res.send(result);
    });
    // add a Enroll
    app.post("/addEnroll", async (req, res) => {
      const doc = req.body;
      const result = await enrollCollection.insertOne(doc);
      res.send(result);
    });
    // enroll collection api
    app.get("/enroll", async (req, res) => {
      const result = await enrollCollection.find().toArray();
      res.send(result);
    });
    // my enrollment api (cart)
    app.get("/myEnroll", async (req, res) => {
      const email = req.query.email;
      const query = { email: email };
      const result = await enrollCollection.find(query).toArray();
      res.send(result);
    });
    // add a Review
    app.post("/review", async (req, res) => {
      const doc = req.body;
      const result = await userReviewCollection.insertOne(doc);
      res.send(result);
    });
    // all review collection api
    app.get("/review", async (req, res) => {
      const result = await userReviewCollection.find().toArray();
      res.send(result);
    });
    await client.db("admin").command({ ping: 1 });
    console.log("Unix Education server successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Unix Server is Running");
});

app.listen(port, () => {
  console.log(`Unix Server Run on Port ${port}`);
});

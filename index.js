const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");

const app = express();
app.use(cors());
app.use(express.json());

const port = process.env.PORT || 3000;
const uri =
  "mongodb+srv://munna:9kLt4Mdx3pKHNqui@munna.nhzbdm8.mongodb.net/?appName=munna";
// const uri =
//   "mongodb+srv://practice:zGMawYsarAIlz8YX@cluster0.5kqjfwt.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    await client.connect();

    const userDB = client.db("usersDB");
    const userCollection = userDB.collection("users");

    app.get("/users", async (req, res) => {
      const cursor = userCollection.find();
      const result = await cursor.toArray();
      res.send(result);
    });
    //app database related api here
    app.post("/users", async (req, res) => {
      const newUser = req.body;
      console.log("user info", newUser);
      const result = await userCollection.insertOne(newUser);
      res.send(result);
    });

    // delete data here
    app.delete("/users/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result);
    });

    await client.db("admin").command({ ping: 1 });
    console.log("✅ Connected to MongoDB!");
  } catch (err) {
    console.error("❌ Connection error:", err);
  }
}

run();

app.get("/", (req, res) => {
  res.send("Hello world!");
});

app.listen(port, () => console.log("App running on port", port));

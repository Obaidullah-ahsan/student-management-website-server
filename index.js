const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

const uri =
  "mongodb+srv://student_management:V3jLd1D7Fc7Pq27e@cluster0.zkk0rbw.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

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
    const studentsCollection = client
      .db("student_management")
      .collection("students");

    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    app.get("/students", async (req, res) => {
      const result = await studentsCollection.find().toArray();
      res.send(result);
    });

    app.post("/addstudent", async (req, res) => {
      const studentInfo = req.body;
      const result = await studentsCollection.insertOne(studentInfo);
      res.send(result);
    });

    app.delete("/student/:id", async (req, res) => {
      const id = req.params.id;
      const query = { _id: new ObjectId(id) };
      const result = await studentsCollection.deleteOne(query);
      res.send(result);
    });

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);

app.get("/", (req, res) => {
  res.send("Student management server is running");
});

app.listen(port, () => {
  console.log(`Student management server is running on port ${port}`);
});

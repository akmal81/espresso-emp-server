const express = require("express");
const cors = require("cors");
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const port = process.env.PORT || 5000;
require('dotenv').config()

const app = express();
app.use(express.json());
app.use(cors())

// connect with database
const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.226ep.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;
// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

async function run() {
    try {
        // Connect the client to the server	(optional starting in v4.7)
        await client.connect();

        const database = client.db("espressoDB")
        const coffeeCollection = database.collection("coffees");
        // operations
        // get all coffees
        app.get('/addCoffee', async (req, res) => {
            const allCoffees = coffeeCollection.find();
            const result = await allCoffees.toArray();
            res.send(result);
        });
        // to show a single coffee also use for update
        app.get('/addCoffee/:id', async (req, res) => {
            const id = req.params.id;
            const query = {_id: new ObjectId(id)};
            const coffee = await coffeeCollection.findOne(query);
            res.send(coffee);
        });

        // insert a coffee
        app.post('/addCoffee', async (req, res) => {
            const coffee = req.body;
            console.log(coffee);
            const result = await coffeeCollection.insertOne(coffee);
            res.send(result);
        });

        // update a coffee
        app.put('/addCoffee/:id', async(req, res)=>{
            const id = req.params.id;
            const coffee = req.body;
            console.log(coffee);
            const filter = {_id: new ObjectId(id)};
            const options = {upsert: true};
            const updateCoffee ={
                $set:{
                    name: coffee.name,
                    chef: coffee.chef,
                    supplier: coffee.supplier,
                    taste: coffee.taste,
                    category: coffee.category,
                    details: coffee.details,
                    price: coffee.price,
                    photo: coffee.photo,

                }
            }
            const result = await coffeeCollection.updateOne(filter, updateCoffee, options);
            res.send(result)
        })

        // Delete a single coffee
        app.delete('/addCoffee/:id', async(req, res)=>{
            const id = req.params.id;
            const coffeeDel = {_id: new ObjectId(id)};
            const result = await coffeeCollection.deleteOne(coffeeDel);
            res.send(result)
        });

        // operations end

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");
    } finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);

// 


app.get('/', (req, res) => {
    res.send('server is running')
})

app.listen(port, () => {
    console.log(`running port: ${port}`);
})
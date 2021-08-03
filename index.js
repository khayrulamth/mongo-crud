const express = require('express');
// const bodyParser = require('body-parser')

const app = express();

const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bdUser:J9R8kU5wCERz*a4@cluster0.19mvk.mongodb.net/bdUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
// app.use(bodyParser.json());
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
//get 
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/index.html');
})


client.connect(err => {
  const productCollection = client.db("bdUser").collection("products");

  //get data from server: read data from database
  app.get('/products', (req, res) => {
    productCollection.find({})
      .toArray((err, documents) => {
        res.send(documents);
      })
  })

  //post data to server: create data from client side
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
      .then((result) => {
        res.send("success");
      })
  });
})

app.listen(3000);
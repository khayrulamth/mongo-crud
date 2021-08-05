const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const ObjectId = require('mongodb').ObjectId;
const { MongoClient } = require('mongodb');
const uri = "mongodb+srv://bdUser:J9R8kU5wCERz*a4@cluster0.19mvk.mongodb.net/bdUser?retryWrites=true&w=majority";
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

// app.use(bodyParser.urlencoded({ extended: false }));
// app.use(bodyParser.json());

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

  app.get('/product/:id', (req, res) => {
    productCollection.find({ _id: ObjectId(req.params.id) })
      .toArray((err, documents) => {
        res.send(documents[0]);
      })
  })

  app.patch('/update/:id', (req, res) => {
    productCollection.updateOne({ _id: ObjectId(req.params.id) },
      {
        $set: { name: req.body.name, price: req.body.price, quantity: req.body.quantity }
      })
      .then(result => {
        res.send(result.modifiedCount>0)
      })
  })

  app.delete('/delete/:id', (req, res) => {
    productCollection.deleteOne({ _id: ObjectId(req.params.id) })
      .then(result => {
        res.send(result.deletedCount > 0)
      })
  })

  //post data to server: create data from client side
  app.post('/addProduct', (req, res) => {
    const product = req.body;
    productCollection.insertOne(product)
      .then((result) => {
        res.redirect('/');
        console.log(result);
      })
  });
})




app.listen(3000);
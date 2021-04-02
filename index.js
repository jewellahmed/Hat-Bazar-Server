const express = require('express')
const app = express()
const MongoClient = require('mongodb').MongoClient;
const bodyParser = require('body-parser')
ObjectID = require('mongodb').ObjectID
const cors = require('cors')
require('dotenv').config()
const port = process.env.PORT || 5055;



app.use(cors())
app.use(bodyParser.json())

// console.log(process.env.DB_USER)


const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.vbtgk.mongodb.net/${process.env.DB_Name}?retryWrites=true&w=majority`;

// console.log(uri)
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

app.get('/', (req, res) => {

  res.send('Hello World')
})


client.connect(err => {
  // console.log(err)
  const productsCollection = client.db("market").collection("goods");


  app.get('/products', (req, res) => {
    productsCollection.find()
      .toArray((err, documents) => {
        res.send(documents);
      })
    })


    app.post('/addProduct', (req, res) => {

      const newProduct = req.body;
      console.log('adding new product:', newProduct);
      productsCollection.insertOne(newProduct)
        .then(result => {

          console.log('Insert count', result.insertedCount)
          res.send(result.insertedCount > 0)
        })

    })

    app.get('/products/:id',(req,res) => {
      const id = ObjectID(req.params.id);
      productsCollection.find({_id:id})
      .toArray((err,items) => {
        console.log(items)
        res.send(items)
      })
    })


  });






  app.listen(process.env.PORT || port)
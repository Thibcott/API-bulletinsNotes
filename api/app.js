const express = require('express')
const { MongoClient, ObjectId} = require('mongodb');
const bodyParser = require('body-parser');
let cors = require('cors');

//instantation de l app express
const app = express();
const port = 3000

// Connection URL
const url = 'mongodb://127.0.0.1:27017';
const client = new MongoClient(url);
let db, collection;

//cors
let allowedOrigins = ['http://localhost:3000', 'http://localhost:5173'];
let options = {
    origin:  'http://localhost:5173',
    methods: ["GET", "POST", "PUT",'DELETE'],
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization'],
    preflightContinue: true,
};

app.use(bodyParser.json());
app.use(cors(options));

// Database Name
const dbName = 'dbNotes';

//connection a la base de données
client.connect()
  .then(() => {
    db = client.db(dbName);
    collection = db.collection('colEpreuve');
  })
  .then(() => {
      // quand la connection a ete etabli lancer l api
    app.listen(port, (err) => {
      console.log("Server started");
    })
  })
  .catch((error) => {
    console.log(error);
  })

//requete

//GEt pour recupere via l id mis en place par mongoDB
app.get('/id/:id',(req, res) => {
  collection.findOne({})
    .toArray((err,data) => {
      if(err) throw err;
    })
})

//GET pour recuperer toute les entrer de la collection
app.get('/', (req, res) => {
  collection.find({})
    .toArray((err, data) => {
      if(err) throw err;

      res.json(data);
    });
})


//GET pour rechercher par branche
app.get('/branche/:b', (req, res) => {
    let b = req.params.b;
    console.log(b)
    collection.find({ branche : b})
        .toArray((err, data) => {
            if(err) throw err;
            console.log(data)
            res.json(data);
        });
})

//GET pour rechercher par nom
app.get('/name/:b', (req, res) => {
    let b = req.params.b;
    console.log(b)
    collection.find({ nom : b})
        .toArray((err, data) => {
            if(err) throw err;
            console.log(data)
            res.json(data);
        });
})
//GET pour rechercher par nom
app.get('/FirstName/:b', (req, res) => {
    let b = req.params.b;
    console.log(b)
    collection.find({ prenom : b})
        .toArray((err, data) => {
            if(err) throw err;
            console.log(data)
            res.json(data);
        });
})

//POST pour ajouter une entrée
app.post('/addEntry',(req, res) =>{
    console.log('Got body:', req.body);
    collection.insertOne(req.body)
        .then(() => {
            res.send("the data has been added")
        }).catch(() => {
            res.send(500)
        })
})

//DELETE pour supprimer une entrée en fonction de l id
app.delete('/del/:id', function (req, res) {
    let id = req.params.id;
    console.log('Got body:', id);
    collection.deleteOne({_id:ObjectId(id)})
        .then(() => {
            res.send("the data has been deleted")
        }).catch(() => {
            res.send(500)
    })
});

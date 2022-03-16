const express = require('express'); //Used for including main express.js file for initialization
const bodyParser= require('body-parser') //Used for including body parser initialization
const app = express(); // Declaring app as a main var for accessing main express function and its childs.
const MongoClient = require('mongodb').MongoClient //Initialzation of MongoClient used by express to communicate with mongoDB
const url = 'mongodb://127.0.0.1:27017' // Default URL of mongoDB for accessing DBs 

app.set('view engine', 'ejs') // Used for including EJS (Embedded JS) Template engine for rendering BSON objects.
app.use(bodyParser.urlencoded({ extended: true })) // Used for including BodyParser for structuring BSON Objects.  
app.use(express.static('public')) //Instructing express framework to look for template file in a specific folder
app.use(bodyParser.json()) // Instructing body parser to use JSON format.

const dbName = 'crud' // giving name to database in MongoDB which we will be using.
let db
let quotesCollection

//Establishing basic connection with Mongo and create a Database for uasge with quotes collection similar to table.
MongoClient.connect(url, { useNewUrlParser: true }, (err, client) => {
    if (err){
        return console.log(err)
    } 
    db = client.db(dbName)
    quotesCollection = db.collection('quotes')
    // console.log(`Connected MongoDB: ${url}`)
    // console.log(`Database: ${dbName}`)
})

//Used by express to listen to a particular port to run.
app.listen(9000, function() {
    console.log('listening on 9000')
})




//Basic functions with GET, POST and DELETE method for processing data.
app.get('/', (req, res) => {
    //res.sendFile(__dirname + '/index.html')
    db.collection('quotes').find().toArray()
    .then(results => {
        res.render('index.ejs', { quotes: results })
    })
    .catch(error => console.error(error))
    //res.render('index.ejs', {})
})
app.post('/quotes', (req, res) => {
    quotesCollection.insertOne(req.body)
    .then(result => {
      //console.log(result)
      res.redirect('/')
    })
    .catch(error => console.error(error))
})
app.post('/Updatequotes', (req, res) => {
    quotesCollection.findOneAndUpdate(
        { name: req.body.Updatename },
        {
            $set: {
                name: req.body.Updatename,
                quote: req.body.Updatequote
            }
        },
        {
            upsert: true
        }
    )
    .then(result => {
        res.redirect('/')
    })
    .catch(error => console.error(error))
})
app.delete('/quotes', (req, res) => {
    quotesCollection.deleteOne(
        { name: req.body.name }
    )
    .then(result => {
        if (result.deletedCount === 0) {
            return res.json('No quote to delete')
        }
        res.json(`Deleted Darth Vadar's quote`)
    })
    .catch(error => console.error(error))
})
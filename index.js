const express = require('express')
const bodyParser = require('body-parser')

// mongodb読み込み
const mongodb = require('mongodb')
const ObjectId = require('mongodb').ObjectID;
const MongoClient = mongodb.MongoClient

const app = express()
app.use(bodyParser.json())
app.set("view engine", "ejs");

app.get('/', function(req, res) {
  MongoClient.connect('mongodb://admin:password@GIP:27017', (err, client) => {
    if (!err) {
      const db = client.db("admin");
      var collection = db.collection("links");
      collection.find().toArray((error, documents) => {
        var data = documents;
        res.render("index.ejs", {data:data});
      });
    } else {
      console.log(err);
    }
  });
})

app.use(bodyParser.urlencoded({
  extended: true
}));


app.post('/', function(req, res) {
  // 挿入時
  console.log(req.body);
  if (req.body.LINK ) {
    MongoClient.connect('mongodb://admin:password@GIP:27017', (err, client) => {
      if (!err) {
        const db = client.db("admin");
        var collection = db.collection("links");
        collection.insertOne({
          "linkname": req.body.TEXT,
          "linkurl": req.body.LINK
        }, (error, result) => {
          console.log(error);
        });
        req.body.TEXT = null;
        req.body.LINK = null;
        collection.find().toArray((error, documents) => {
          var data = documents;
          res.render("index.ejs", {data:data});
        });
      } else {
        console.log(err);
      }
    });
  }
  // 削除時
  if (req.body.delete) {
    var docid = req.body.delete;
    MongoClient.connect('mongodb://admin:password@GIP:27017', (err, client) => {
      if (!err) {
        const db = client.db("admin");
        var collection = db.collection("links");
        collection.deleteMany(
          { _id: { $eq: ObjectId(docid) } },
          (error, result) => {
            console.log(error);
          }
        );
        collection.find().toArray((error, documents) => {
          var data = documents;
          res.render("index.ejs", {data:data});
        });
      } else {
        console.log(err);
      }
    });
  }
})

app.listen(process.env.PORT || 3000)

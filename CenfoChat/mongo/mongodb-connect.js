var mongo = require("mongodb");

var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/cenfochatdb";


module.exports = {
  connectToMongo : function(){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("cenfochatdb");
      dbo.createCollection("mensages", function(err, res) {
        if (err) throw err;
        db.close();
      });
    });
  },
  insertChatMessage : function(msg){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("cenfochatdb");
      dbo.collection("mensages").insertOne(JSON.parse(msg), function(err, res) {
        if (err) throw err;
        console.log("1 mensage agregado.");
        db.close();
      });
    });
  },
  selectOne : function(callback){
    MongoClient.connect(url, function(err, db) {
      if (err) throw err;
      var dbo = db.db("cenfochatdb");
      dbo.collection("mensages").findOne({}, function(err, result) {
        if (err) throw err;
        console.log(JSON.stringify(result));
        //callback(result);
        db.close();
      });
    });
  }
};
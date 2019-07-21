var express = require ('express');
var path = require('path');
var bodyParser = require('body-parser');
var mongo = require ('mongoose');
var mongodb = require('mongodb');



var MongoClient = require('mongodb').MongoClient;
var url = "mongodb+srv://usr119:YrBcNNLAokS3p2ip@fyp1-dktdt.gcp.mongodb.net/";

MongoClient.connect(url, function(err, db) {
  if (err) throw err;
  var dbo = db.db("fyp");
  dbo.collection("gomo_analysis").find({}, { projection: { Motif_Identifier: 1, GOMo_Score: 2} }).toArray(function(err, 

result) {
    if (err) throw err;
    console.log(result);
    db.close();
  });
});

var app =express();
app.use(bodyParser());
app.use(bodyParser.json({limit:'5mb'}));
app.use(bodyParser.urlencoded({extended:true}));


app.use(function(req,res,next){

    res.setHeader('Access-Control-Allow-Origin','http://localhost:4200');
    res.setHeader('Access-Control-Allow-Methods','GET,POST,OPTIONS,PUT,PATCH,DELETE');
    res.setHeader('Access-Control-Allow-Methods','X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Methods',true);
    
});

var schema = mongo.Schema;


var  motifData = new mongo.Schema({
    _id:{type:Object},
    promoter:{type:String},
    enhancer:{type:String},
    encode_no:{type:Number},
    chr_type:{type:String},
    enhancer_width:{type:Number},
    promoter_width:{type:Number},
    pair_no:{type:Number},
    enhancer_matrix:{type:Array},
    promoter_matrix:{type:Array}

})

var motif_model = mongo.model('motif',motifData,'motif_data');
var gomo_model = mongo.model('gomo',motifData,'gomo_data');

app.get("/api/getMotif",function(req,res){
  model.find({},function(err,data){

    if(err){
        res.send(err);
    }else{
        res.send(data);
    }

  });

});




app.get("/api/getGOMO",function(req,res){
  MongoClient.connect(url, function(err, db) {
    if (err) throw err;
    var dbo = db.db("fyp");
    dbo.collection("gomo_analysis").find({}, { projection: { Motif_Identifier: 1, GOMo_Score: 2} }).toArray(function(err, 
  
  result) {
      if (err) throw err;
      console.log(result);
      db.close();
    });
  });
return res;
});




  app.listen(8080,function() {
      console.log("Example app listening on 8000");
  
});
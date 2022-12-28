const mongoose = require('mongoose');
const express = require('express');
const app = express();
const path = require('path');
const config = require('./config.js');
let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");

const PORT = process.env.PORT || 8000;

app.locals.types = require('./data/comm-fridge-types.json');
app.locals.fridges = require('./data/comm-fridge-data.json');
console.log(app.locals.fridges);
app.locals.items = require('./data/comm-fridge-items.json');
/// routers
const fridgesRouter = require("./fridge-router.js");
const itemsRouter = require("./item-router.js");
const searchRouter = require("./search-router.js");

let db;
app.locals.db = db;

// MIDDLEWARE
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use((req,_,next)=> {
    console.log(`${req.method}: ${req.url}`);
    if (Object.keys(req.body).length > 0){
        console.log('Body:');
        console.log(req.body);
    }
    next();
});

//Mount the fridge router to the path /fridges
//All requests starting with /fridges will be forwarded to this router
app.use("/fridges", fridgesRouter);

//Mount the items router to the path /items
//All requests starting with /items will be forwarded to this router
app.use("/items", itemsRouter);

//Mount the search router to the path /search
//All requests starting with /search will be forwarded to this router
app.use("/search", searchRouter);

app.use(express.static("public"));

//Start the connection to the database
mongoose.connect(config.db.host, {useNewUrlParser: true, useUnifiedTopology: true});

//Get the default Mongoose connection (can then be shared across multiple files)
db = mongoose.connection;

db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
  //We're connected
  console.log("Connected to the database...");

  // Intialize the types collection in the database by using the data in the file: comm-fridge-types.json
  Type.find({}, function (err, result){
    if (err){console.log(err);}
    else{
      console.log("Result :", result);
      if(result.length === 0){
        console.log("Intializing the types collection...");
        Type.insertMany(app.locals.types, function(err, result){
          if(err){
            console.log(err);
            return;
          }
          console.log(result);
/////////////////////////////////////////////////////////////////////////////

/////////////////////////////////////////////////////////////////////////////
        });
      }
    }
  });
  // Intialize the items collection in the database by using the data in the file: comm-fridge-items.json
  Item.find({}, function (err, result){
    if (err){console.log(err);}
    else{
      console.log("Result :", result);
      if(result.length === 0){
        console.log("Intializing the items collection...");
        Item.insertMany(app.locals.items, function(err, result){
          if(err){
            console.log(err);
            return;
          }
          console.log(result);
////////////////////////////////////////////////////////////////////
        });
      }
    }
 });
///////////////////////
// Intialize the fridges collection in the database by using the data in the file: comm-fridge-data.json
Fridge.find({}, function (err, result){
  if (err){console.log(err);
  } else {
    console.log("Result :", result);
    if(result.length === 0){
      console.log("Intializing the fridges collection...");
      Fridge.insertMany(app.locals.fridges, function(err, result){
        if(err){
          console.log(err);
          return;
        }
        console.log(result);
        app.listen(PORT, ()=> {
          console.log(`Server listening on http://localhost:${PORT}`)
          });
      });
    } else {
      app.listen(PORT, ()=> {
        console.log(`Server listening on http://localhost:${PORT}`)
        });
    }
  }
});// end of fridge.find()

///////////////////////////////////////////////////////////////////

});

// terminates a connection to the database when the node application finishes
process.on('SIGINT', function() {
  mongoose.connection.close(function () {
    console.log('Mongoose disconnected through app termination');
    process.exit(0);
  });
});

///////////////// error 500 handling ////////////////
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).send('Something failed at the server!');
});
////////////////////////////////////////////////////

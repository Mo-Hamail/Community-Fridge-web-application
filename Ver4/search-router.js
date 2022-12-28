// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
/////////////////////////
let Type = require("./models/typeModel");
//let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");
/////////////////////////////
app.use(express.json()); // body-parser middleware

// Get /search/items of type and name then return all the mathced items
router.get('/items', (req,res)=> {
  res.format({
  'text/html': ()=> {
    res.set('Content-Type', 'text/html');
    res.sendFile(path.join(__dirname,'public','search_item.html'),(err) =>{
      if(err) res.status(500).send('500 Server error');
    });
  },
  'application/json': ()=> {
    // check query string
      let qStr = checkQuery(req.query);
      if(qStr == 400) {
        res.status(400).send("The search query is poorly formatted.");
      } else {
        ////////////////////////////////////////////////////////////////
        //// we have 4 cases for "type and name "
        /// retrieve all items with the name (if exists) and type (if exists)
        if(req.query.type.length != 0 && req.query.name.length != 0) {
          Type.findOne().where("name").equals(req.query.type)
          .exec(function(err, foundType) {
            if(err) throw err;
            if(foundType) {
              let regStr = new RegExp(".*" + req.query.name + ".*", 'i');
              let retrieveItemsQuery = Item.find()
              .where("name").regex(regStr)
              .where("type").equals(foundType.id);
              retrieveItemsQuery.exec(function(err, result){
                if(err) throw err;
                console.log("Retrieve Items with name and type query:");
                console.log("\n\n RESULT ========\n" + result);
                res.status(200).set("Content-Type", "application/json").json(result);
              });
            } else {
              res.status(200).set("Content-Type", "application/json").json("[]");
            }
          });
        }
        /// retrieve all items of a specified type, if type exists
        if(req.query.type.length != 0 && req.query.name.length == 0) {
          Type.findOne().where("name").equals(req.query.type)
          .exec(function(err, foundType) {
            if(err) throw err;
            if(foundType) {
              let retrieveItemsQuery = Item.find().where("type")
              .equals(foundType.id);
              retrieveItemsQuery.exec(function(err, result){
                if(err) throw err;
                console.log("Retrieve All Items query:");
                console.log("\n\n RESULT ========\n" + result);
                res.status(200).set("Content-Type", "application/json").json(result);
              });
            } else {
              res.status(200).set("Content-Type", "application/json").json("[]");
            }
          });
        }
        // retrieve all items with the name and all types
        if(req.query.type.length == 0 && req.query.name.length != 0) {
          let regStr = new RegExp(".*" + req.query.name + ".*", 'i');
//          console.log(regStr);
          let retrieveItemsQuery = Item.find().where("name").regex(regStr);
          retrieveItemsQuery.exec(function(err, result){
              if(err) throw err;
              console.log("Retrieve All Matched Items query:");
              console.log("\n\n RESULT ========\n" + result);
              res.status(200).set("Content-Type", "application/json").json(result);
          });
        }

        // retrieve all items from the DB
        if(req.query.type.length == 0 && req.query.name.length == 0) {
          let retrieveItemsQuery = Item.find();
          retrieveItemsQuery.exec(function(err, result){
            if(err) throw err;
            console.log("Retrieve All Items query:");
            console.log("\n\n RESULT ========\n" + result);
            res.status(200).set("Content-Type", "application/json").json(result);
          });
        }

        /////////////////////////////////////////////////////////////////
        // get type id
        // if(req.query.type.length != 0 ) {
        //
        // } else { // retrieve all items, type and name is empty
        //   let regStr;
        //   if(req.query.name.length != 0) {
        //     regStr = "/.*" + req.query.name + ".*/i";
        //     let retrieveItemsQuery = Item.find().where("name").regex(regStr);
        //     retrieveItemsQuery.exec(function(err, result){
        //         if(err) throw err;
        //         console.log("Retrieve All Matched Items query:");
        //         console.log("\n\n RESULT ========\n" + result);
        //         res.status(200).set("Content-Type", "application/json").json(result);
        //     });
        //   } else {
        //     // let retrieveItemsQuery = Item.find();
        //     // retrieveItemsQuery.exec(function(err, result){
        //     //   if(err) throw err;
        //     //   console.log("Retrieve All Matched Items query:");
        //     //   console.log("\n\n RESULT ========\n" + result);
        //     //   res.status(200).set("Content-Type", "application/json").json(result);
        //     // });
        //   }
        // } //else retieve all items
        // // get matched partial name and type
        // // let retrieveItemsQuery = Item.find();
        // // retrieveItemsQuery.exec(function(err, result){
        // //   if(err) throw err;
        // //   console.log("Retrieve All Matched Items query:");
        // //   console.log("\n\n RESULT ========\n" + result);
        // //   res.status(200).set("Content-Type", "application/json").json(result);
        // // });
      ///////////////////////////////////////////////
      }
    },
    'default' : ()=> {
        res.status(406).send('Not acceptable');
    }
  });
});
function checkQuery(query) {
  let qKeys = ["type", "name"];
  if(Object.keys(query).length === 0 || Object.keys(query).length > 2) {
    return 400;
  }
  /// check for values of sent data
  for(let i = 0; i < qKeys.length; i++) {
    if(query[qKeys[i]] === undefined) {
      console.log("here");
      return 400;
    }
  }
  return 200;
}


module.exports = router;

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

// Get /items and return the all of the fridges based on requested format
router.get('/', (req,res)=> {
    res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','add_item.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
      let retrieveItemsQuery = Item.find();
      retrieveItemsQuery.exec(function(err, result){
    		if(err) throw err;
    		console.log("Retrieve All Items query:");
        console.log("\n\n RESULT ========\n" + result);
        res.status(200).set("Content-Type", "application/json").json(result);
  	  });
    ///////////////////////////////////////////////
      },
      'default' : ()=> {
          res.status(406).send('Not acceptable');
      }
    })
});

// Add new item in Items collection /items
router.post('/', (req,res)=> {
  let newItem = {};
  let validItem = validateItem(req.body);
  console.log(validItem);
  /// check returned value validItem, 400, 409, or 200 OK
  if(validItem === 400) {
    res.status(400).send("The one or more of the new item data is poorly formatted.");
  } else {
      // check if exists in items // DB
      Item.findOne().where("name").equals(req.body.name).exec(function(err, foundItem) {
      if(err) throw err;
      if(!foundItem) {
        Type.findOne().where("id").equals(req.body.type)
        .exec(function(err, foundType) {
        if(err) throw err;
        if(foundType){
          let retrieveItemsQuery = Item.find();
          retrieveItemsQuery.exec(function(err, result){
            if(err) throw err;
            // get the newItem data from request body
            newItem.id = result.length + 1;
            newItem.name = req.body.name;
            newItem.type = req.body.type;
            newItem.img = req.body.img;
            Item.insertMany(newItem, function(err, result) {
                
                if(err) { // schema violation
                  res.status(400).send("Fridge Collection schema violation.");
                } else {
                  res.status(200).set("Content-Type", "application/json").json(newItem);
                }
            });
          });
        } else {
          res.status(400).send("The new item type doesn't exist.");
        }
        });
      } else {
        res.status(409).send("The new item already exists in items DB");
      }
    });
   }
});

function validateItem(itemData) {
  let itemKeys = ["name", "type", "img"];
  //let itemData = itemInReq.body;
  console.log(itemData);
  // check if number of keys in the request body is valid
  if(Object.keys(itemData).length === 0 || Object.keys(itemData).length > 3) {
    return 400;
  }

  /// check for values of sent data
  for(let i = 0; i < itemKeys.length; i++) {
    if(itemData[itemKeys[i]] === undefined) {
      console.log("here");
      return 400;
    }
  }
  /// check schema violations
  if(itemData.name.length < 3 || itemData.name.length > 25 ||
    itemData.type.length < 1 || itemData.type.length > 4 ||
    itemData.img.length < 5 || itemData.img.length > 256) {
      return 400;
  }
  // finally body data is OK.
  return 200;
  // /// check if an item exists with the same name
  // let result = retrieveItemByName(itemData.name);
  // console.log(result);
  // if(result) {
  //   return 409;
  // } else {
  //   return 200;
  // }

  // let retrieveItemsQuery = Item.find().where("name").equals(itemData.name);
  // const result = await retrieveItemsQuery.exec(function(err){
  //   if(err) throw err;
  //   if(result) {
  //     return 409;
  //   } else {
  //     return 200;
  //   }
  // });
}
async function retrieveItemByName(itemName) {
  // check if exists in items // DB
  const result = await Item.findOne().where("name").equals(itemName).exec(function(err, result) {
    //console.log("428" + result);
    if(err) throw err;
  });
  if(!result) {
    //console.log("430" + result);
    return undefined;
  } else {
    //console.log("433" + result);
    return result;
  }
}
module.exports = router;

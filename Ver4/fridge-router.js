// This module is cached as it has already been loaded
const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
let router = express.Router();
/////////////////////////
let Type = require("./models/typeModel");
let Fridge = require("./models/fridgeModel");
let Item = require("./models/itemModel");
/////////////////////////////
app.use(express.json()); // body-parser middleware

// Get /fridges and return the all of the fridges based on requested format
router.get('/', (req,res)=> {
    res.format({
		'text/html': ()=> {
			res.set('Content-Type', 'text/html');
			res.sendFile(path.join(__dirname,'public','view_pickup.html'),(err) =>{
				if(err) res.status(500).send('500 Server error');
			});
		},
		'application/json': ()=> {
			//res.set('Content-Type', 'application/json');
      let retrieveFridgesQuery = Fridge.find();
      retrieveFridgesQuery.exec(function(err, result){
    		if(err) throw err;
    		console.log("Retrieve All Fridges query:");
        console.log("\n\n RESULT ========\n" + result);
        res.status(200).set("Content-Type", "application/json").json(result);
  	  });
    ///////////////////////////////////////////////
      //res.json(req.app.locals.fridges);
      },
      'default' : ()=> {
          res.status(406).send('Not acceptable');
      }
    })
});
// helper route, which returns the accepted types currently available in our application. This is used by the addFridge.html page
router.get("/types", function(req, res, next){
	let types = [];
  Object.entries(req.app.locals.items).forEach(([key, value]) => {
    if(!types.includes(value["type"])){
      types.push(value["type"]);
    }
  });
	res.status(200).set("Content-Type", "application/json").json(types);
});

// Middleware function: this function validates the contents of the request body associated with adding a new fridge into the application. At the minimimum, it currently validates that all the required fields for a new fridge are provided.
function validateFridgeBody(req,res,next){
  // access the body of the POST
  let newFridge = {
    "id": "",
    "name": req.body.name,
    "numItemsAccepted": 0,
    "canAcceptItems": Number(req.body.canAcceptItems),
    "acceptedTypes": req.body.acceptedTypes,
    "contactInfo": {
      "contactPerson": req.body.contactInfo.contactPerson,
      "contactPhone": req.body.contactInfo.contactPhone,
    },
    "address": {
      "street": req.body.address.street,
      "postalCode": req.body.address.postalCode,
      "city": req.body.address.city,
      "province": req.body.address.province,
      "country": "Canada"
    },
    "items": []
  };
console.log(newFridge);
  if(newFridge.name === undefined || newFridge.canAcceptItems === undefined || newFridge.canAcceptItems === Number.NaN || newFridge.acceptedTypes === undefined ||
      newFridge.acceptedTypes.length == 0 ||
      newFridge.contactInfo.contactPerson === undefined || newFridge.contactInfo.contactPhone === undefined || newFridge.address === undefined ||
      newFridge.address.street === undefined || newFridge.address.postalCode === undefined || newFridge.address.city === undefined ||
      newFridge.address.province === undefined) {

        return res.status(400).send("The one or more of the new fridge data is poorly formatted.");
  }

  next();
}
// Middleware function: this validates the contents of request body, verifies item data
// function validateItemBody(req,res,next){
//     let properties = ['id','quantity'];
//     for (property of properties){
//         if (!req.body.hasOwnProperty(property))
// 			return res.status(400).send("Bad request");
//     }
//     next();
// }
// Adds a new fridge, returns newly created fridge
router.post('/', validateFridgeBody, (req,res)=> {
  console.log("POST request to add new fridge");
  let newFridge = {
    "id": "",
    "name": req.body.name,
    "numItemsAccepted": 0,
    "canAcceptItems": Number(req.body.canAcceptItems),
    "acceptedTypes": req.body.acceptedTypes,
    "contactInfo": {
      "contactPerson": req.body.contactInfo.contactPerson,
      "contactPhone": req.body.contactInfo.contactPhone,
    },
    "address": {
      "street": req.body.address.street,
      "postalCode": req.body.address.postalCode,
      "city": req.body.address.city,
      "province": req.body.address.province,
      "country": "Canada"
    },
    "items": []
  };
  ////// check if accepted types are legit
  Type.find().exec(function(err, typeDocs) {
    if(err) throw err;
    let found = false;

    for(let i = 0; i < newFridge.acceptedTypes.length; i++) {
      found = false;
      for(let j = 0; j < typeDocs.length; j++) {
        if(newFridge.acceptedTypes[i] == typeDocs[j].id) {
          found = true;
          break;
        }
      }
      if(!found) {
        break;
      }
    }

    if (found) {
      /////// Update DB - fridges
        let retrieveFridgesQuery = Fridge.find();
        retrieveFridgesQuery.exec(function(err, result){
          if(err) throw err;
          newFridge.id = `fg-${result.length+1}`;//"fg-"+ result.length + 1;
          //newFridge.push({id:`fg-${result.length+1}`, ...req.body, items:[]});
          console.log(newFridge);
          Fridge.insertMany(newFridge, function(err, result) {
            //if(err) throw err;
            if(err) { // schema violation
                res.status(400).send("Fridge Collection schema violation.");
            } else {
                res.status(200).set("Content-Type", "application/json").json(newFridge);
            }
          });
      });
    } else {
       res.status(400).send("one or more of acceptedTypes don't exist");
    }
  });
  ////////////////////////////////////////////////
//console.log(found);
});
async function isType(typeId) {
  // await Type.findOne().where("id").equals(typeId)
  // .exec(function(err, foundType) {
  //   if(err) throw err;
  //   if(!foundType) {
  //
  //     return false;
  //     //return res.status(400).send("one or more of acceptedTypes don't exist");
  //   } else {
  //     return true;
  //   }
  // });
  /////////////////
  //const promise = Type.findOne().where("id").equals(typeId).exec();
  return await Type.findOne().where("id").equals(typeId).then (docs => {
    docs; // the Type doc
  });
}
function validateUpdateFridgeData(req,res,next){
  // access the body of the PUT
  let fridgeMainKeys = ["name", "numItemsAccepted", "canAcceptItems", "acceptedTypes", "contactInfo", "address", "items"];
  let contactInfoKeys = ["contactPerson", "contactPhone"];
  let addressKeys = ["street", "postalCode", "city", "province", "country"];
  let itemsKeys = ["id", "quantity"];
  /// check main keys of fridge object ///
  //let fridgeKeys = Object.Keys(req.body);
  let
  for(let i = 0; i < fridgeMainKeys.length-1; i++) {

  }
  /////////////////////////////////////////////////////////////////
  let newFridge = {
    "id": "",
    "name": req.body.name,
    "numItemsAccepted": 0,
    "canAcceptItems": Number(req.body.canAcceptItems),
    "acceptedTypes": req.body.acceptedTypes,
    "contactInfo": {
      "contactPerson": req.body.contactInfo.contactPerson,
      "contactPhone": req.body.contactInfo.contactPhone,
    },
    "address": {
      "street": req.body.address.street,
      "postalCode": req.body.address.postalCode,
      "city": req.body.address.city,
      "province": req.body.address.province,
      "country": "Canada"
    },
    "items": []
  };
console.log(newFridge);
  if(newFridge.name === undefined || newFridge.canAcceptItems === undefined || newFridge.acceptedTypes === undefined ||
      newFridge.contactInfo.contactPerson === undefined || newFridge.contactInfo.contactPhone === undefined || newFridge.address === undefined ||
      newFridge.address.street === undefined || newFridge.address.postalCode === undefined || newFridge.address.city === undefined ||
      newFridge.address.province === undefined) {

        console.log("heeeere");
    return res.status(400).send("The one or more of the new fridge data is poorly formatted.");
  }
  next();
}
/////////////////////////////////////////////////////////////////////////
// Get /fridges/{fridgeID}. Returns the data associated with the requested fridge.
router.get("/:fridgeId", function(req, res, next){
	//const fridges = req.app.locals.fridges;
	//const items = req.app.locals.items;

	// Find fridge in 'database'
  ////////////////////////////////////////////
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, fridgeFound){
    if(err) throw err;
    console.log("Retrieve a Fridge query:");
    console.log("\n\n RESULT ========\n" + fridgeFound);
    if(!fridgeFound) {
      return res.status(404).send('Not Found');
    }
  ///////////////// get items from the DB
  let i = 0;
  //let frd = {...fridgeFound};
  //console.log(frd.items[i]);
  //console.log("\n\n frd *******\n" +frd);
//      for (let i = 0; i < fridgeFound.items.length; i++) {
          let retrieveItemQuery = Item.findOne().where("id")
                                  .equals(fridgeFound.items[i].id);
          retrieveItemQuery.exec(function(err, itemData) {
          fridgeFound.items[i].id = JSON.stringify(itemData);
          console.log(itemData);

      });
//    }
    console.log(fridgeFound);
    res.status(200).set("Content-Type", "application/json").json(fridgeFound);
  });
  ////////////////////////////////////////////
	// const fridgeFound = fridges.find(f => f.id == req.params.fridgeId);
	// if(!fridgeFound) return res.status(404).send('Not Found');
  //
	// // Make deep copy of fridges data
	// let fridge = {...fridgeFound};
  //
	// // Populate items array with item data matched with itemID
	// // TODO: IS THIS NEEDED??
	// for (let i = 0; i < fridge.items.length; i++) {
	// 	fridge.items[i] = {...items[fridge.items[i].id], ...fridge.items[i]};
	// }
	// res.json(fridge);

});
////////////////////////////////////////////////////////////////////////
function updateFridge(fridge, fData) {

  let keys;
  let dummyItem = {id: "", quantity: 0};

  return new Promise((resolve, reject) => {
    keys = Object.keys(fData);
    if(keys.length === 0) {
      //return 400; // bad body data.
      console.log("273");
      resolve({data: 400});
    }
    /// check main properties of fData is a fridge property.
    for(let i = 0; i < keys.length; i++) {
      if(!(keys[i] in fridge)) {
        //return 400; // bad body data.
        console.log("280");
        resolve({data: 400});
      }
    }
    // check for keys of the contactInfo object inside fridge object
    if(("contactInfo" in fData)) {
      keys = Object.keys(fData.contactInfo);
      for(let i = 0; i < keys.length; i++) {
        if(!(keys[i] in fridge.contactInfo)) {
          console.log(keys);
          //return 400; // bad body data.
          resolve({data: 400});
        }
      }
    }
    // check for keys of the address object inside fridge object
    if(("address" in fData)) {
      keys = Object.keys(fData.address);
      for(let i = 0; i < keys.length; i++) {
        if(!(keys[i] in fridge.address)) {
          console.log(keys);
          //return 400; // bad body data.
          resolve({data: 400});
        }
      }
    }
    // check items Keys
    if(("items" in fData)) {
      keys = Object.keys(fData.items);
      if(keys.length === 0 || fridge.items.length === 0) {
        //return 400; // bad body data.
        console.log("311");
        resolve({data: 400});
      }
      for(let i = 0; i < fData.items.length; i++) {
        //if(!(keys[i] in fridge.items[0])) {
        if(fData.items[i].id === undefined || fData.items[i].quantity === undefined) {
          //return 400; // bad body data.
          // console.log(keys[i]);
          // console.log("317");
          resolve({data: 400});
        }
      }
    }
   // check if acceptedTypes contains valid types
   ////// check if accepted types are legit
   if(("acceptedTypes" in fData)) {

     if(fData.acceptedTypes.length == 0) {
       //return 400; // bad body data.
       resolve({data: 400});
     }
      console.log("before");
      Type.find().exec(function(err, typeDocs) {
       if(err) throw err;
       let foundType = false;
       //console.log("heeeeeerrrrr" + fData.acceptedTypes.length);
       for(let i = 0; i < fData.acceptedTypes.length; i++) {
         foundType = false;
         for(let j = 0; j < typeDocs.length; j++) {
           if(fData.acceptedTypes[i] == typeDocs[j].id) {
             foundType = true;
             break;
           }
         }
         if(!foundType) {
           //return 400; // bad body data.
           resolve({data: 400});
         }
       }
       console.log("==========inside");
       //return commitFridgeUpdate(fridge, fData);
       resolve({data: 200});
     });
   }
  }); // end of promise
 }
/////////////////////////////////////////////////////////////////////
function commitFridgeUpdate(fridge, fData) {
  //////////////////////////////////////////////
  console.log("here in commit firidge update");
   let keys = Object.keys(fData);
   let dummyItem = {id: "", quantity: 0};

   console.log("before update fridge =====> \n" + fridge);
   /// updating fridge object
   for(let i = 0; i < keys.length; i++) {
     if(keys[i] === "address") {
       let addressKeys = Object.keys(fData.address);
       for(let j = 0; j < addressKeys.length ; j++) {
         fridge.address[addressKeys[j]] = fData.address[addressKeys[j]];
       }
       continue;
     }
     if(keys[i] === "contactInfo") {
       let contactInfoKeys = Object.keys(fData.contactInfo);
       for(let j = 0; j < contactInfoKeys.length ; j++) {
         fridge.contactInfo[contactInfoKeys[j]] = fData.contactInfo[contactInfoKeys[j]];
       }
       continue;
     }
     if(keys[i] === "items") {
        continue;
      }
     /// if not Address, Items, contactInfo
     fridge[keys[i]] = fData[keys[i]];
   }
   // check for keys of the items object inside fridge object
   //console.log(keys);
   let found = false;
   if(("items" in fData)) {
       // check for proper items objects in fridge data
       for(let j = 0; j < fData.items.length; j++) {
         keys = Object.keys(fData.items[j]);
           for(let k = 0; k < fridge.items.length; k++) {
             if(fridge.items[k].id == fData.items[j].id) {
               found = true;
               break;
             }
           }
           if(found) {
             found = false;
           } else {
             return 400;
           }
       }// for j < fData.items.length
       /// update quantities of sent items after checking of existance
       for(let j = 0; j < fData.items.length; j++) {
         for(let k = 0; k < fridge.items.length; k++) {
           if(fridge.items[k].id == fData.items[j].id) {
             ///////////////////////////////////
              fridge.items[k].quantity = fData.items[j].quantity;
              console.log("item in list OOOOOOO");
             }
         }
       }
   }

  return fridge;
}
//////////////////////////////////////////////////////////////////////////
// /////// check schema violations ////////////
// function checkFridgeSchema() {
//
// }
/////////////////////////////////////////////////////////////////////////
// Updates a fridge and returns the data associated.
// Should probably also validate the item data if any is sent, oh well :)
router.put("/:fridgeId", (req, res) =>{
  // Find fridge in 'database'
  ////////////////////////////////////////////
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, foundFridge){
    if(err) throw err;
    if(!foundFridge) {
      res.status(404).send('The fridgeID does not exist');
    } else {
      console.log("PUT: Retrieve a Fridge query:");
      //console.log("\n\n410 RESULT ========\n" + foundFridge);
//////////////////////////////////////////////////////////////////////
      updateFridge(foundFridge, req.body).then(processResult => {

        console.log("556 ==== " + processResult.data);
      	if(processResult.data === 400) { /// bad body data
      		res.status(400).send("One or more of fridge data is wrong.");
      	} else { // update fridge
          let result = commitFridgeUpdate(foundFridge, req.body);
          if(result === 400) {
            res.status(400).send("One or more of fridge data is wrong.");
          } else { // the fridge successfully updated
            result.save(function(err) {
              if(err) { // schema violation
                 res.status(400).send("Fridge Collection schema violation.");
              } else {
                console.log("at the end of request====>" + result);
                res.status(200).set("Content-Type", "application/json").json(result);
              }
            });
          }
      	}
      }); // end of recieving Promise.
    }
  });
});
// check request body validity
function validateReqBodyItem(req) {
  // check for proper items objects in request Body, then in DB
  return new Promise((resolve, reject) => {

    let bodyItem = {"id": req.body.id, "quantity": req.body.quantity}; console.log("419" + bodyItem);
    if (bodyItem.id === undefined || bodyItem.quantity === undefined) {
      console.log("420" + bodyItem);
      //return 400;
      resolve({data: 400});
    }
    if(bodyItem.id.length < 1 ||  bodyItem.id.length > 4 ||
      isNaN(bodyItem.quantity)) {
        console.log("488");
        //return 400;
        resolve({data: 400});
    }
    //////////////////////////////////////////////////////////////////
    // check if exists in items // DB
    Item.findOne().where("id").equals(bodyItem.id).exec(function(err, result) {
      //console.log("428" + result);
      if(err) throw err;
      if(!result) {
        console.log("499" + result);
        //return 400;
        resolve({data: 400});
      } else {
        //console.log("433" + result);
        //return bodyItem;
        resolve({data: bodyItem});
      }
    });
  }); // end of promise
}
async function retrieveItem(anItem) {
  // check if exists in items // DB
  await Item.findOne().where("id").equals(anItem.id).exec(function(err, result) {
    //console.log("428" + result);
    if(err) throw err;
    if(!result) {
      //console.log("430" + result);
      return undefined;
    } else {
      //console.log("433" + result);
      return result;
    }
  });
}
// Adds an item to specified fridge
router.post("/:fridgeId/items", (req,res)=>{
  let found = false;
  let newItem;
  // Find fridge in 'database'
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, foundFridge) {
    if(err) throw err;
    if(!foundFridge) {
      res.status(404).send('The fridgeID does not exist');
    } else {
      // Find item in 'database'
      validateReqBodyItem(req).then (processResult =>{
        newItem = processResult.data;
        console.log("456-- " + newItem);
        if(newItem == 400) {
          res.status(400).send('Bad request body');
        } else {
          // Add item to fridge if doesn't exists in fridge's items
          for(let i = 0; i < foundFridge.items.length; i++) {
  //////////////////////////////////////////////////////////////////////
            if(foundFridge.items[i].id == newItem.id) {
                found = true;
              }
            }
            if(found) {
              found = false;
              res.status(409).send('Item already exists !!!');
            } else {
              Fridge.updateOne(
                { id: foundFridge.id },
                { $push: { "items" :  newItem} },
                { new: true },
                function(err, result){
                  //if (err) throw err;
                  if(err) { // schema violation
                     res.status(400).send("Fridge-items Collection schema violation.");
                  } else {
                    console.log("\nres in updateOne ===> \n" + res);
                    res.status(200).set("Content-Type", "application/json").json(result);
                  }
                });
            }
  ///////////////////////////////////////////////////////////////////////
          }
      }); // end of Promise
      }
  });
});

// Deletes an item from specified fridge
router.delete("/:fridgeId/items/:itemId", (req,res)=>{
  let found = false;
  // Find fridge in 'database'
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, foundFridge) {
    if(err) throw err;
    if(!foundFridge) {
      res.status(404).send('The fridgeId does not exist');
    } else {
      // Find item in fridge's item'
      for (let i = 0; i < foundFridge.items.length; i++) {
        if(req.params.itemId == foundFridge.items[i].id) {
          found = true;
          break;
        }
      }
      if(found) {
        found = false;
        /// delete item from items in a fridge.
        Fridge.updateOne(
              { id: req.params.fridgeId},
              {$pull: { items: {id: req.params.itemId} }},
              { new: true },
              function (err, result) {
                if (err) throw err;
                res.status(200).set("Content-Type", "application/json").json(result);
        });
      } else {
        res.status(404).send('The itemId does not exist');
      }
    }
  });
});
// delete items from the fridge.
router.delete("/:fridgeId/items", (req,res)=>{
  let found = false;
  console.log("query===");
  console.log(req.query);

  // Find fridge in 'database'
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, foundFridge) {
    if(err) throw err;
    if(!foundFridge) {
      res.status(404).send('The fridgeIdd does not exist');
    } else {
      // Find item in fridge's items'
      if(Object.keys(req.query).length === 0){
        console.log("query===");
        foundFridge.items = [];
        foundFridge.save();
        res.status(200).send("All items in the fridge have been deleted");
      } else {
        if(req.query.item === undefined || Object.keys(req.query).length > 1) {
          res.status(400).send('Bad request query string');
        } else {

          for(let qi = 0; qi < req.query.item.length; qi++) {
            found = false;
            for (let i = 0; i < foundFridge.items.length; i++) {
              if(req.query.item[qi] == foundFridge.items[i].id) {
                found = true;
                break;
              }
            }
            if(!found) {
                break;
            }
            console.log(req.query.item.length);
          }
          if(found) {
            found = false;
            Fridge.updateMany(
                  { id: req.params.fridgeId},
                  {$pull: { items: {id: {$in: req.query.item} } }},
                  //{$pull: { items: {id: req.query.item[qi]} }},
                  { new: true },
                  function (err, result) {
                    if (err) throw err;
                    res.status(200).set("Content-Type", "application/json").json(result);
            });
          } else {
            res.status(404).send('one or all items do not exist');
          }
        }
      }
    }
  });
});
////////////////////////////////////////////////////////////////////////
// Updates a fridge's item and returns the updated item.
router.put("/:fridgeId/items/:itemId", (req, res) =>{
  console.log("PUT: /:fridgeId/items/:itemID update item query:");
  // Find fridge in 'database'
  ////////////////////////////////////////////
  let found = false;
  let iNdx = 0;
  // Find fridge in 'database'
  let retrieveFridgeQuery = Fridge.findOne().where("id").equals(req.params.fridgeId);
  retrieveFridgeQuery.exec(function(err, foundFridge) {
    if(err) throw err;
    if(!foundFridge) {
      res.status(404).send('The fridgeId does not exist');
    } else {
      // Find item in fridge's item'
      for (let i = 0; i < foundFridge.items.length; i++) {
        if(req.params.itemId == foundFridge.items[i].id) {
          found = true;
          iNdx = i;
          foundFridge.items[i].quantity = Number(req.body.quantity);
          break;
        }
      }
      if(found) {
        found = false;
        /// update item from items in a fridge.
        foundFridge.save(function(err, result) {
          if(err) throw err;
          res.status(200).set("Content-Type", "application/json").json(foundFridge.items[iNdx]);
        });
      } else {
        res.status(404).send('The itemId does not exist');
      }
    }
  });
});

module.exports = router;

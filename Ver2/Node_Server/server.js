const http = require("http"); // import the http module, so that we can create a web server
const file = require("fs"); // import the fs (file system) module so that we read and write data to files
const url = require("url"); // import the url module so we can parse the web address of the request into readable parts
var fridges;
var items;

const host = "localhost"; // address of the server; localhost means that the server is referring to itself and is not accessible from the internet
const port = 8000; // port most commonly used by webservers

const server = http.createServer(processRequest);// create the server object

server.listen(port, host, () => { // Bind the port and host to the server
  console.log("Server is running!");
});

file.readFile('../js/comm-fridge-data.json', 'utf8', function(err, contents) {
  if(err){
    response.writeHead(500, {"Content-Type": "application/javascript"});
    response.end();
    return;
  }
fridges = JSON.parse(contents);
});
// read comm-fridge-items.json file
 file.readFile('../js/comm-fridge-items.json', 'utf8', function(err, contents) {
   if(err){
     response.writeHead(500, {"Content-Type": "application/javascript"});
     response.end();
     return;
   }
items = JSON.parse(contents);

}); // read file successfully to update fridge

// process a request received, prepare and send a response back to the client
function processRequest(request, response){
  let queryObject = url.parse(request.url, true); // parses the URL into readable parts
  let fLocation = queryObject.pathname.substr(1);

  console.log(queryObject.pathname);
//////////////////////////////////// post treatment /////////////////
////////////////////////add item request /////////////////////

/////////////////////////////////////////////////////////////
if(request.method === "POST"){
  let data = "";

  request.on('data', chunk => {
      data += chunk.toString();
  });
  request.on('end', () => {
      queryObject = url.parse(data, true);

      if(fLocation === "drop.html") { //dropping off items to a specific fridge
        processFridgeData(queryObject, response);
      } else if (fLocation === "add_item.html") { //add new item in the item list
        console.log(fLocation);
        processAddItemData(queryObject, response);
      }
      //console.log(data);
    }); //end of request data received
  } // end of if statement
/////////////////////////////////////////////////////////////////////
  //console.log(fLocation);
  else if(fLocation.indexOf(".html") > -1){
      file.readFile("../" + fLocation, 'utf8', function(err, contents) {
			if(err){
				response.writeHead(500, { "Content-Type": "text/html"});
				response.end();
				return;
			}
			response.writeHead(200, { "Content-Type": "text/html"});
			response.end(contents);
		});
  }

  else if(fLocation.indexOf(".css") > -1 ){
    file.readFile("../" + fLocation, 'utf8', function(err, contents) {
    			if(err){
    				response.writeHead(500, { "Content-Type": "text/css"});
    				response.end();
    				return;
    			}
    			response.writeHead(200, { "Content-Type": "text/css"});
    			response.end(contents);
    		});
  }

  else if(fLocation.indexOf(".js") > -1){
    file.readFile("../" + fLocation, 'utf8', function(err, contents) {
          if(err){
            response.writeHead(500, { "Content-Type": "application/javascript"});
            response.end();
            return;
          }
          response.writeHead(200, { "Content-Type": "application/javascript"});
          response.end(contents);
        });
  }

  else if(fLocation.indexOf(".json") > -1){
    file.readFile("../" + fLocation, 'utf8', function(err, contents) {
          if(err){
            response.writeHead(500, {"Content-Type": "application/javascript"});
            response.end();
            return;
          }
          response.writeHead(200, {"Content-Type": "application/javascript"});
          response.end(contents);
        });
  }

  else if(fLocation.indexOf(".jpeg") > -1){
		file.readFile("../" + fLocation, function(err, contents) {
			if(err){
				response.writeHead(500, {"Content-Type": "image/jpeg"});
				response.end();
				return;
			}
			response.writeHead(200, {"Content-Type": "image/jpeg"});
			response.end(contents);
		});

  }
  else if(fLocation.indexOf(".svg") > -1){
		file.readFile("../" + fLocation, function(err, contents) {
			if(err){
				response.writeHead(500, {"Content-Type": "image/svg+xml"});
				response.end();
				return;
			}
			response.writeHead(200, {"Content-Type": "image/svg+xml"});
			response.end(contents);
		});
  }
  else if(fLocation.indexOf(".ico") > -1){
    file.readFile("../" + fLocation, function(err, contents) {
      if(err){
        response.writeHead(500, {"Content-Type": "image/x-icon"});
        response.end();
        return;
      }
      response.writeHead(200, {"Content-Type": "image/x-icon"});
      response.end(contents);
    });
  }
}

// run the server: node server.js
// if you make a change to your server code, you must restart the server
function processFridgeData(queryObject, response) {
  //console.log(queryObject);
  // read comm-fridge-data.json file
  // file.readFile('../js/comm-fridge-data.json', 'utf8', function(err, contents) {
  //   if(err){
  //     response.writeHead(500, {"Content-Type": "application/javascript"});
  //     response.end();
  //     return;
  //   }
  //   fridges = JSON.parse(contents);
  //  console.log(fridges);
    // update the fridge data using fdNdx (fridge original index)
    // then updating the specified item in this fridge using iNdx
    fridges[parseInt(queryObject.query.fdNdx)].num_items_accepted = parseInt(queryObject.query.num_items_accepted);
    fridges[parseInt(queryObject.query.fdNdx)].can_accept_items = parseInt(queryObject.query.can_accept_items);
    fridges[parseInt(queryObject.query.fdNdx)].items[parseInt(queryObject.query.iNdx)].quantity = parseInt(queryObject.query.i_quantity);

//    }); // read file successfully to update fridge
  //console.log(fridges[parseInt(queryObject.query.fdNdx)].items[parseInt(queryObject.query.iNdx)].quantity);
  // write the updated fridges to the comm-fridge-data.json file to save the data
  // send the new data back to the client
  file.writeFile('../js/comm-fridge-data.json', JSON.stringify(fridges), function (writeError) {
    if (writeError){
      console.log("There was an error writing to the students.json file.");
      throw err;
    }
    else {
      // read contents from the file again
      file.readFile('../js/comm-fridge-data.json', 'utf8', function(err, contents) {
        if(err){
          //console.log("There was an error reading the comm-fridge-data.json file.\n error" + err);
          response.writeHead(500, {"Content-Type": "application/javascript"});
          response.end();
          return;
        }
        response.writeHead(200, {"Content-Type": "application/javascript"});
        response.end(contents);
      }); // read file successfully to send to client
    }
  }); // write file successfully
}

function processAddItemData(queryObject, response) {
  // update the items list data
   let newItem = {
     name: queryObject.query.name,
     type: queryObject.query.type,
     img:queryObject.query.img
   };
   items.push(newItem);

  // write the updated items list to the comm-fridge-items.json file to save the data
  // send the new data back to the client
  console.log(items);
  file.writeFile('../js/comm-fridge-items.json', JSON.stringify(items), function (writeError) {
    if (writeError){
      console.log("There was an error writing to the comm-fridge-items.json file.");
      throw err;
    }
    else {
      // read contents from the file again
      file.readFile('../js/comm-fridge-items.json', 'utf8', function(err, contents) {
        if(err){
          //console.log("There was an error reading the comm-fridge-data.json file.\n error" + err);
          response.writeHead(500, {"Content-Type": "application/javascript"});
          response.end();
          return;
        }
        response.writeHead(200, {"Content-Type": "application/javascript"});
        response.end(contents);
      }); // read file successfully to send to client
    }
  }); // write file successfully


}// end of processAddItemData(queryObject, response) function...

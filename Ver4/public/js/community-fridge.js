var xhttp; // variable to store the XMLHttpRequest object
var groceries = null;
//var fridgesList = null;
var foundFridgesList = [];
var fridgesDirectIndex = [];
var flag = 0;
var frdgId;
/////////////////////////////////////////////////////////////
var fridgeNumber = 0;
let categories = {};
//var fridge_inc_dec = {};
/////////////////////////////////////////////////////////////
function prepFridges() {
  flag = 1;
  //requestData("http://localhost:80/js/comm-fridge-data.json");
  requestData("http://localhost:8000/fridges");

}
function requestData(URL){
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = processData; // specify what should happen when the server sends a response
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send(); // send the request to the server
}

// process data returned by the AJAX request
function processData(){
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
		//console.log(xhttp);
		// if(xhttp.responseURL.indexOf("comm-fridge-items.json") > -1) {
		// 	groceries = JSON.parse(data);  // Convert the JSON data to a JavaScript object
	  //   //console.log(groceries); // print the object, so we can see the fields
	  //   populateGroceryItems(); // use the groceries object to populate the DOM for the table
		// }
		// else if (xhttp.responseURL.indexOf("comm-fridge-data.json") > -1) {
			let fridgesList = JSON.parse(data);
			console.log(fridgesList);
//      if(flag === 1) {
      loadFridges(fridgesList);
//      } else if(flag === 2) {
//        findFridges();
//      }
//		}
  }
  else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
}

function loadFridges(fridgesList){
let fridge_menu = document.getElementById('fridge_menu');
let i = 0;
for(i = 0; i < fridgesList.length; i++){
  // creating fridge list item
    let frdg_lst_item = document.createElement("li");
    frdg_lst_item.className = "menu_item";
    frdg_lst_item.id =  "menu_item";
    //console.log(fridgesList[i].id);
    frdg_lst_item.dataset.fridgeId = fridgesList[i].id;
    console.log(frdg_lst_item.dataset.fridgeId);
    //frdg_lst_item.onclick = "showFridge(value)";
    frdg_lst_item.setAttribute("onclick", "getFridge(dataset.fridgeId)");
    // creating <a> element
    let frdg_link = document.createElement("a");
    frdg_link.className = "clickable";
    //frdg_link.href = "pickup.html";
    // creating the image
    let frdg_img = document.createElement("img");
    frdg_img.className = "fridge_img";
    frdg_img.src = "images/fridge.svg";
    frdg_img.alt = "fridge pic";
    frdg_link.appendChild(frdg_img);
    // creating a list that contains fridge name, address , and phone number
    let frdg_rec = document.createElement("ul");
    frdg_rec.className = "fridge_info";
    frdg_rec.id = "fridge_info";
    let frdg_n = document.createElement("li");
    frdg_n.innerHTML = fridgesList[i].name;
    frdg_rec.appendChild(frdg_n);
    let frdg_a = document.createElement("li");
    frdg_a.innerHTML = fridgesList[i].address.street;
    //frdg_a.value = i;
    frdg_rec.appendChild(frdg_a);
    let frdg_p = document.createElement("li");
    frdg_p.innerHTML = fridgesList[i].contact_phone;
    frdg_rec.appendChild(frdg_p);
    //frdg_p.value = i;
    frdg_link.appendChild(frdg_rec);
    frdg_lst_item.appendChild(frdg_link);
    fridge_menu.appendChild(frdg_lst_item);

  }
  let edit_frdge_div = document.getElementById('edit_frdge');
  ///// add fridge button ///////////////////////
  let addLink = document.createElement("p");
  addLink.innerHTML = '<br><a class="editlink" href="fridges/addFridge">&oplus; Add New Fridge</a>';
  edit_frdge_div.appendChild(addLink);
  ////////////////////////////////////////////////////
  for(i = 0; i < fridgesList.length; i++) {
    ///// add edit fridge button ///////////////////////
    let editLink = document.createElement("p");
    let updBtn = document.createElement("button");
    updBtn.id = 'submit_btn1';
    updBtn.setAttribute("onclick", "editFridge(dataset.fridgeId)");
    updBtn.textContent = "Edit " + fridgesList[i].name;
    updBtn.dataset.fridgeId = fridgesList[i].id;
    edit_frdge_div.appendChild(updBtn);
    ////////////////////////////////////////////////////
  }
}
/////////////////////////////////////////////////////
function getFridge(frdgId) {
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = function() {
    processFridgeData(frdgId);
  }; // specify what should happen when the server sends a response
  let URL = "http://localhost:8000/fridges/" + frdgId;
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send(); // send the request to the server
}
function processFridgeData(frdgId){
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
			fridge = JSON.parse(data);
			console.log(fridge);
      /////////////// get items list from the server ////////
      let url = "http://localhost:8000/fridges/items";
      xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
      xhttp.onreadystatechange = function() {
        readyToShowFridge(fridge);
      }; // specify what should happen when the server sends a response
      xhttp.open("GET", url, true); // open a connection to the server using the GET protocol
      xhttp.setRequestHeader("Accept", "application/json");
      xhttp.send(); // send the request to the server
      ///////////////////////////////////////////////////////
      //showFridge(fridge);
  } else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
}
function readyToShowFridge(fridge) {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
		let itemsList = JSON.parse(data);
    console.log(itemsList);
    showFridge(fridge, itemsList);
  } else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request in getting itemsList.");
	}
}
function showFridge(fridge, itemsList) {
  localStorage.setItem('fridge', JSON.stringify(fridge));
  localStorage.setItem('itemsList', JSON.stringify(itemsList));
  //fridge_inc_dec = fridge;
  ///////////////////////////////////////////
  let itemKeys = Object.keys(itemsList);
  console.log(itemKeys);
  ///////////////////filter unique types of items //////////
  let uniqueTypes = [];
  for(let i = 0; i < itemKeys.length; i++) {
    if(uniqueTypes.indexOf(itemsList[itemKeys[i]].type) == -1) {
      uniqueTypes.push(itemsList[itemKeys[i]].type);
    }
  }
  ////////////////////////////////////////////////////////////
  var flsec_elem = document.getElementById("frdg_list_sec");
  var fisec_elem = document.getElementById("frdge_all_info_sec");
  ////////////////////// Header ////////////
  var head = document.createElement("h1");
  head.className = "home_h1";
  head.id = "frdg_h1";
  let value = "Items in the " + fridge.name;
  head.textContent = value;
  fisec_elem.appendChild(head);
  ////////////////////// div container for left-center-right frdg_pans ///////
  let contdiv = document.createElement("div");
  contdiv.className = "frdg_pans";
  ///////////////////// left pan //////////
  let leftdiv = document.createElement("div");
  leftdiv.className = "frdg_data_left";
  let naclist = document.createElement("ul");
  naclist.className = "frdge_info_lst";
  naclist.id = "frdge_info";
  let naclist_item = document.createElement("li");
  naclist_item.className = "name_li";
  naclist_item.id = "name_li";
  naclist_item.textContent = fridge.name;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  naclist_item.textContent = fridge.address.street;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  naclist_item.textContent = fridge.contact_phone;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  let prog = document.createElement("progress");
  prog.className = "meter";
  prog.id = "file";
  let frCap = fridgeItemsCapacity(fridge);
  prog.value = frCap;
  prog.max = "100";
  prog.textContent = frCap + "%";
  naclist_item.appendChild(prog);
  naclist.appendChild(naclist_item);
  leftdiv.appendChild(naclist);
  //////////////////////// categories list //////////
  naclist = document.createElement("ul");
  naclist.className = "frdg_cat_lst";
  naclist.id = "frdg_cat_lst";
///////////////////////////////////
/////////////////////////////////test area ////////
// var cats = [];
// let t = fridgesList[frdg_num].items[0].type;
// let cType = {};
// cType[fridgesList[frdg_num].items[0].type] = fridgesList[frdg_num].items[0].quantity;
// cats.push(cType);
// console.log(cats);
////////////////////////////////////////////////////////
  let i;
  let flags = [];
  //////////// construct the categories array ////////////
  //let cType = {};
  for(i = 0; i < itemKeys.length; i++) {
    //console.log(itemsList[itemKeys[i]].type);
    if(flags[itemsList[itemKeys[i]].type]) continue;

    flags[itemsList[itemKeys[i]].type] = true;
    let type = itemsList[itemKeys[i]].type;
    console.log(type);
    categories[type] = 0;
  }
  //console.log(flags);
  // for(i = 0; i < fridge.items.length; i++) {
  //   if(flags[itemsList[fridge.items[i].id].type]) continue;
  //
  //     flags[fridge.items[i].id] = true;
  //     categories[itemsList[fridge.items[i].id].type] = 0;
  // }
  //categories.push(cType);
  console.log(categories);
//////////// sums for each category ////////////////
  for(i = 0; i < fridge.items.length; i++) {
    let tname = itemsList[fridge.items[i].id].type;
    categories[tname] += fridge.items[i].quantity;
  }
  console.log (categories);
  let cats = Object.keys( categories );
  let catLen = Object.keys( categories ).length;
  for(let cat = 0;  cat < catLen; cat++) {
    naclist_item = document.createElement("li");
    naclist_item.className = "frdg_cat_lst_itm";
    //itemsList[cats[cat]].type
    naclist_item.textContent = cats[cat] + " " + "(" + categories[cats[cat]] + ")";
    naclist_item.value = cat;
    naclist_item.setAttribute("onclick", "catFilter(value)");
    naclist.appendChild(naclist_item);
  }
  leftdiv.appendChild(naclist); // categories list + quantities
  /////////////////////////////////////////
  /////////////////// Center pan //////////
  let centerdiv = document.createElement("div");
  centerdiv.className = "frdg_data_center";
  centerdiv.id = "cntr_div";
  let itable = document.createElement("table");
  itable.id = "itable";

  //////// for each element in items do ////////
  let itm;
  for (itm = 0; itm < fridge.items.length; itm++) {

  let row = document.createElement("tr");
  row.className = "item_row";
  let imgCell = document.createElement("td");
  let item_img = document.createElement("img");
  item_img.className = "item_img";

  item_img.src = itemsList[fridge.items[itm].id].img;
  item_img.alt = itemsList[fridge.items[itm].id].name;
  imgCell.appendChild(item_img);
  row.appendChild(imgCell);

  let item_info = document.createElement("td");
  item_info.className = "item_info";
  let pinfo = document.createElement("p");
  //pinfo.textContent = fridge.items[itm].name;
  pinfo.textContent = itemsList[fridge.items[itm].id].name;
  item_info.appendChild(pinfo);
  pinfo = document.createElement("p");
  pinfo.textContent = "Quantity: " + fridge.items[itm].quantity;
  item_info.appendChild(pinfo);
  pinfo = document.createElement("p");
  pinfo.textContent = "Pickup Item: ";
  item_info.appendChild(pinfo);

  row.appendChild(item_info);

  let amount = document.createElement("td");
  //amount.value = fridges[frdg_num].items[itemNames[itm]].quantity;
  amount.className = "amount";

  let btn = document.createElement("button");
  btn.className = "btn_inc";
  btn.id = fridge.items[itm].id; //itemNames[itm];
  //fridges[frdg_num].items[itemNames[0]];
  btn.setAttribute("onclick", "increment(id)");
  btn.textContent = "+";
  amount.appendChild(btn);
  let labcount = document.createElement("label");
  labcount.className = "counter" ;
  labcount.id = fridge.items[itm].id + "-counter";//"counter";
  labcount.textContent = "0";
  amount.appendChild(labcount);

  btn = document.createElement("button");
  btn.className = "btn_dec";
  btn.id = fridge.items[itm].id; //itemNames[itm];
  btn.setAttribute("onclick", "decrement(id)");
  btn.textContent = "-";
  amount.appendChild(btn);

  row.appendChild(amount);
  /////////////////////////////////////////
  itable.appendChild(row);
} /// end of each elements in items
  centerdiv.appendChild(itable);
  ////////////////// Right pan ////////////
  let rightdiv = document.createElement("div");
  rightdiv.className = "frdg_cart_right";
  let c_head_div = document.createElement("div");
  c_head_div.className = "cart_head";

  head = document.createElement("h4");
  head.textContent = "You have picked up the following items:";
  c_head_div.appendChild(head);
  rightdiv.appendChild(c_head_div);

  let items_pick_div = document.createElement("div");
  items_pick_div.className = "cart_items";
  items_pick_div.id = "cart_items";
  rightdiv.appendChild(items_pick_div);

  let del_pickedup = document.createElement("div");
  del_pickedup.className = "hidden";
  del_pickedup.id = "delete_pickedUp";
  del_pickedup.style.textAlign = "center";
  let del_btn = document.createElement("button");
  del_btn.className = "pickup";
  del_btn.id = "submit_btn1";
  del_btn.setAttribute("onclick", "processPickedup()");
  del_btn.textContent = "Picked up Done";
  del_pickedup.appendChild(del_btn);
  rightdiv.appendChild(del_pickedup);
  /////////////////////////////////////////
  //////////////// append all to section ///////
  contdiv.appendChild(leftdiv);
  contdiv.appendChild(centerdiv);
  contdiv.appendChild(rightdiv);
  fisec_elem.appendChild(contdiv);
  /////////////////////////////////////////////
  //// show the chosen fridge inventory ///////
  if (flsec_elem.style.display === "none") {
    flsec_elem.style.display = "block";
    fisec_elem.style.display = "none";
  } else {
    flsec_elem.style.display = "none";
    fisec_elem.style.display = "block";
  }
}
////////////////////////////////////////////////
function fridgeItemsCapacity(fridge) {
  return Math.round((fridge.items.length / (fridge.can_accept_items + fridge.items.length)) * 100);
  // let totalItemsQuantity = 0;
  // for(let i = 0; i < fridge.items.length; i++) {
  //   totalItemsQuantity += fridge.items[i].quantity;
  // }
  // return Math.round((fridge.can_accept_items / (totalItemsQuantity + fridge.can_accept_items)) * 100 );
}
/////////////////// handling delete items for pick up ////////////////////
function processPickedup() {
  //event.preventDefault();
  fridge = JSON.parse(localStorage.getItem('fridge'));

  let cartItems = [];
  let itemData = {id: "", quantity: 0}
  let cart_items = document.getElementById("cart_items");

  if(cart_items.children.length == 0) {
    alert("No items in the Cart, Error!!!");
    return;
  }
  //console.log(cart_items.children);
  for(let i = 0; i < cart_items.children.length; i++) {
    //console.log(cart_items.children[i].value);
    let itemData = {id: "", quantity: 0}
    itemData.id = cart_items.children[i].value;
    itemData.quantity = cart_items.children[i].dataset.quantity;
    console.log(itemData);
    cartItems.push(itemData);
  }
  let query = new URLSearchParams();

  //let URL= "/fridges/" + fridge.id + "/items/?";
  for(let i = 0; i < cartItems.length; i++) {
    query.append("itemId" + (i+1), cartItems[i].id);
    // URL += "itemId" + (i+1) + "="+ cartItems[i].id;
    // if(cartItems.length < i+1) {
    //   URL += "&";
  }
  let URL= "/fridges/" + fridge.id + "/items/?" + query.toString();

  console.log(cartItems);
  console.log(URL);
  /////////////////// send DELETE request ////////
  sendDeleteReq(URL, deleteRequestHandle);
}
function sendDeleteReq(URL, reqProc) {
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
  xhttp.onreadystatechange = reqProc; // specify what should happen when the server sends a response
  xhttp.open("DELETE", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "text/html");
  xhttp.send(); // send the request to the server

}
function deleteRequestHandle() {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
      alert("The required Items have been picked up");
  }
  else {
    console.log(xhttp.readyState + "---" + xhttp.status);
    console.log("There was a problem with the request.");
  }

}
/////////////////////////////////////////////////
function increment(itemid){
  //fridges[fridgeNumber].items[itemid].name;
  fridge = JSON.parse(localStorage.getItem('fridge'));
  itemsList = JSON.parse(localStorage.getItem('itemsList'));
  //fridge = fridge_inc_dec;
  console.log(itemid);
  let cartItemsDiv = document.getElementById('cart_items');
  let filteredArray = Object.values(fridge.items).filter(invent => invent.id == itemid);
  //console.log(filteredArray[0]);
  let citems = document.getElementById(itemid + "-cart");

  let quant = document.getElementById(itemid + "-counter");
  if (Number(quant.textContent) == Number(filteredArray[0].quantity) ){
    return;
  }
  let total = Number(quant.textContent);
  total++;
  if(citems == null) {
    citems = document.createElement("p");
    citems.id = filteredArray[0].id + "-cart";
    citems.value = filteredArray[0].id;
    citems.dataset.quantity = total;
    quant.textContent = total;
    citems.textContent = quant.textContent + " X " + itemsList[filteredArray[0].id].name;

  } else {
    citems.value = filteredArray[0].id;
    quant.textContent = total;
    citems.dataset.quantity = total;
    citems.textContent = quant.textContent + " X " + itemsList[filteredArray[0].id].name;
  }
  cartItemsDiv.appendChild(citems);

  let del_pickedup = document.getElementById("delete_pickedUp");
  del_pickedup.className = "";
  //console.log(fridges[fridgeNumber].items[itemid].name);
}
function decrement(itemid){
  //fridge = fridge_inc_dec;
  fridge = JSON.parse(localStorage.getItem('fridge'));
  itemsList = JSON.parse(localStorage.getItem('itemsList'));
  let cartItemsDiv = document.getElementById('cart_items');
  let filteredArray = Object.values(fridge.items).filter(invent => invent.id == itemid);
  //console.log(filteredArray[0]);
  let citems = document.getElementById(itemid + "-cart");

  let quant = document.getElementById(itemid + "-counter");
  if (Number(quant.textContent) === 0){
    return;
  }
  let total = Number(quant.textContent);
  total--;
  console.log(total);
  if(citems == null) {
    citems = document.createElement("p");
    citems.id = filteredArray[0].id + "-cart";
    citems.dataset.quantity = total;
    quant.textContent = total;
    citems.textContent = quant.textContent + " X " + itemsList[filteredArray[0].id].name;

  } else {
    if(total > 0) {
      quant.textContent = total;
      citems.dataset.quantity = total;
      citems.textContent = quant.textContent + " X " + itemsList[filteredArray[0].id].name;
      cartItemsDiv.appendChild(citems);
    } else {
      console.log(total);
      quant.textContent = total;
      citems.parentNode.removeChild(citems);
      // check if still items in the cart
      let cart_items = document.getElementById("cart_items");
      if(cart_items.children.length == 0) {
        let del_pickedup = document.getElementById("delete_pickedUp");
        del_pickedup.className = "hidden";
      }
    }
  }

}
function catFilter(catNum) {
  //////////////////////////////////////////////////////////////
  fridge = JSON.parse(localStorage.getItem('fridge'));
  itemsList = JSON.parse(localStorage.getItem('itemsList'));

  //return;
  let cats = Object.keys( categories );
  //let catLen = Object.keys( categories ).length;

  let filteredArray = Object.values(fridge.items).filter(invent => itemsList[invent.id].type == cats[catNum]);
	if(filteredArray.length == 0) { // do nothing in case of zero items
		return;
	}
  let centerdiv = document.getElementById("cntr_div");
  /// retrieve table of id itable
  let itable = document.getElementById("itable");
  /// delete all table
  itable.parentNode.removeChild(itable);
  itable = document.createElement("table");
  itable.id = "itable";
  /// create new tr with the filteredArray.

  /////////////////////////////////////////////////////////////////////
  //////// for each element in items do ////////
  for (var itm in filteredArray) {

  let row = document.createElement("tr");
  row.className = "item_row";
  let imgCell = document.createElement("td");

  let item_img = document.createElement("img");
  item_img.className = "item_img";
  item_img.src = itemsList[filteredArray[itm].id].img;
  item_img.alt = itemsList[filteredArray[itm].id].name;
  imgCell.appendChild(item_img);
  row.appendChild(imgCell);

  let item_info = document.createElement("td");
  item_info.className = "item_info";
  let pinfo = document.createElement("p");
  pinfo.textContent = itemsList[filteredArray[itm].id].name;
  item_info.appendChild(pinfo);
  pinfo = document.createElement("p");
  pinfo.textContent = "Quantity: " + filteredArray[itm].quantity;
  item_info.appendChild(pinfo);
  pinfo = document.createElement("p");
  pinfo.textContent = "Pickup Item: ";
  item_info.appendChild(pinfo);

  row.appendChild(item_info);

  let amount = document.createElement("td");
  //amount.value = fridges[frdg_num].items[itemNames[itm]].quantity;
  amount.className = "amount";

  let btn = document.createElement("button");
  btn.className = "btn_inc";
  btn.id = filteredArray[itm].id; //itemNames[itm];
  //fridges[frdg_num].items[itemNames[0]];
  btn.setAttribute("onclick", "increment(id)");
  btn.textContent = "+";
  amount.appendChild(btn);
  let labcount = document.createElement("label");
  labcount.className = "counter" ;
  labcount.id = filteredArray[itm].id + "-counter";//"counter";
  labcount.textContent = "0";
  amount.appendChild(labcount);

  btn = document.createElement("button");
  btn.className = "btn_dec";
  btn.id = filteredArray[itm].id; //itemNames[itm];
  btn.setAttribute("onclick", "decrement(id)");
  btn.textContent = "-";
  amount.appendChild(btn);

  row.appendChild(amount);

  /////////////////////////////////////////
  itable.appendChild(row);
} /// end of each elements in filteredArray
  centerdiv.appendChild(itable);
  /////////////////////////////////////////////////////////////////////
//console.log( Object.values(fridges[fridgeNumber].items).filter(user => user.type == catNames[catNum]) );
}
/////////////////////////////////////////////////
///////////////////////////////////////////// drop off items in fridges //////////////////

function loadItems(){
	document.getElementById("number_items").addEventListener("input", checkFrmFields);
	document.getElementById("grocery_items").addEventListener("change", checkFrmFields);
	document.getElementById("submit_btn").addEventListener("click", processFrdgeFrm);

  flag = 2;
	requestData("http://localhost:8000/js/comm-fridge-items.json");
}
function checkFrmFields(event) {
	let message = document.getElementById("respArea");
	message.className = "hidden";
  let resultsView = document.getElementById("view_results");
  resultsView.className = "hidden";


	if(event.target.id === "number_items") {
			checkIfNum(event.target.id);
	}
	checkFrmComp();
}
function checkFrmComp(){
  let gList = document.getElementById("grocery_items");
  let selectedItmNdx = gList.selectedIndex;
  let nItems = document.getElementById("number_items");
  let bt_sub = document.getElementById("submit_btn");

  if(nItems.classList.contains("error") || nItems.value == '' ||
     selectedItmNdx == -1) {
       bt_sub.disabled = true;
       return false;
     }
     bt_sub.disabled = false;
     return true;
}

function checkIfNum(id){
  let elem = document.getElementById(id);
  let elem_val = elem.value;
  elem.classList.remove("valid", "error");
  if(elem_val == '')
    return 2;
  if (isNaN(elem_val)){
    elem.classList.add("error");
    return 1;
  } else {
    elem.classList.add("valid");
    return 0;
  }
}

////////////////////////////////// Adding dropped off items to fridges part //////
function processFrdgeFrm(event) {
	event.preventDefault();
	requestData("http://localhost:8000/js/comm-fridge-data.json");
}

function findFridges() {
	console.log(fridgesList);
	let gList = document.getElementById("grocery_items");
	let nItems = document.getElementById("number_items");
	foundFridgesList = [];
	let selectedItmNdx = gList.selectedIndex;
	//console.log(nItems.value);

	let i;
	let listLen = fridgesList.length;
	for(i=0 ; i < listLen; i++) {
		if (checkFridge(fridgesList[i], selectedItmNdx, nItems)) { // fridges found then do ...
			foundFridgesList.push(fridgesList[i]);
			fridgesDirectIndex.push(i);
		}

	} // finding fridges loop
	console.log(foundFridgesList);
	createViewResultsSec(selectedItmNdx);

	//console.log(groceries[selectedItmNdx].type);
}
function createViewResultsSec(selectedItmNdx) {
	let resultsView = document.getElementById("view_results");
	resultsView.innerHTML = '';
	let listLen = foundFridgesList.length;
	resultsView.innerHTML = "<h2>Available fridges</h2>";
	let fList = document.createElement("ul");
	fList.className = "found_fridge_ul";
	let i;
  let recom_one = -1;
  if(listLen != 0) {
    recom_one = recommnedFridge(selectedItmNdx);
    console.log(recom_one);
  }

	for(i=0; i < listLen; i++) {
		let frdg_lst_item = document.createElement("li");
		//////////////////////////////////////////////////////
		frdg_lst_item.className = "fli";
		frdg_lst_item.id = i;
		frdg_lst_item.value = i;
		frdg_lst_item.setAttribute("onclick", "commitDropOffItems(value)");
    if(recom_one === i){
      frdg_lst_item.style.background = "#aefc2f";
    }
		// creating <a> element
		let frdg_link = document.createElement("a");
		//frdg_link.className = "clickable";
		// creating the image
		let frdg_img = document.createElement("img");
		frdg_img.className = "found_fridge_img";
		frdg_img.src = "images/fridge.svg";
		frdg_img.alt = "fridge pic";
		frdg_link.appendChild(frdg_img);
		// creating a list that contains fridge name, address , and phone number
		let frdg_rec = document.createElement("ul");
		frdg_rec.className = "frdg_data_lst";
		//frdg_rec.id = "fridge_info";
		let frdg_data = document.createElement("li");
		frdg_data.className = "found_fridge_li";
		frdg_data.innerHTML = foundFridgesList[i].name;
		frdg_rec.appendChild(frdg_data);
		frdg_data = document.createElement("li");
		frdg_data.innerHTML = foundFridgesList[i].address.street;

		frdg_rec.appendChild(frdg_data);
		frdg_data = document.createElement("li");
		frdg_data.className = "found_fridge_li";
		frdg_data.innerHTML = foundFridgesList[i].contact_phone;
		frdg_rec.appendChild(frdg_data);

		frdg_data = document.createElement("li");
		frdg_data.className = "found_fridge_li";
		frdg_data.className = "red_ones";
		frdg_data.innerHTML = "Capacity: " + foundFridgesList[i].capacity;
		frdg_rec.appendChild(frdg_data);

		frdg_data = document.createElement("li");
		//frdg_data.className = "red_ones";
		frdg_data.className = "found_fridge_li";
		frdg_data.innerHTML = "Can accept # of items: " + foundFridgesList[i].can_accept_items;
		frdg_rec.appendChild(frdg_data);
		///////////////////////////////////////
		frdg_link.appendChild(frdg_rec);
		frdg_lst_item.appendChild(frdg_link);
		fList.appendChild(frdg_lst_item);
		////////////////////////////////////////////////////////
	}
	resultsView.appendChild(fList);
	resultsView.className = "";
	//resultsView.style.display = "inline";
}
function recommnedFridge(selectedItmNdx) {
  let listLen = foundFridgesList.length;
  let recommended = -1;
  let quantity = Number.MAX_VALUE;
//console.log(listLen);
  if(listLen === 0) { // list is empty
    return recommended;
  }
  if(listLen === 1) { // only one fridge in the list
    recommended = 0;
    return recommended;
  }
  for(let i = 0; i < listLen ; i++) {
    //console.log(foundFridgesList[i].items.length);
    for (let j = 0; j < foundFridgesList[i].items.length; j++) {
      //console.log(foundFridgesList[i].items[j].name);
      if(groceries[selectedItmNdx].name === foundFridgesList[i].items[j].name) {
          if(foundFridgesList[i].items[j].quantity < quantity) {
            recommended = i;
            quantity = foundFridgesList[i].items[j].quantity;
          } else if(foundFridgesList[i].items[j].quantity === quantity) {
                if(foundFridgesList[i].capacity < foundFridgesList[recommended].capacity) {
                    recommended = i;
                }
          } // case quantities are equale for current and current recommneded
      } //if item found
    }
  }

  return recommended;
}

function checkFridge(fridge, grocNdx, nItems) {

	if(fridge.capacity != 100 && checkRecType(fridge, grocNdx) && nItems.value < fridge.can_accept_items ) {
		return true;
	}
	return false;
}

function checkRecType(fridge, grocNdx) {
	let listLen = fridge.accepted_types.length;
	let i;

	for (i=0; i < listLen ; i++) {
			if(fridge.accepted_types[i] === groceries[grocNdx].type) {
				return true;
			}
	}
	return false;
}

function commitDropOffItems(value) {
	//console.log(foundFridgesList[value]);
	let gList = document.getElementById("grocery_items");
	let nItems = document.getElementById("number_items");
	let selectedItmNdx = gList.selectedIndex;
	let listLen = foundFridgesList[value].items.length;
	let i;
	let itemNdx = 0;
	let numItems = Number(nItems.value);
	foundFridgesList[value].can_accept_items -= numItems;
	foundFridgesList[value].num_items_accepted = numItems;
	for(i = 0; i < listLen; i++) {
		if(foundFridgesList[value].items[i].name === groceries[selectedItmNdx].name) {
			foundFridgesList[value].items[i].quantity += numItems;
			itemNdx = i;
			i = listLen;
		}
	}
////////////////////// prepare updated data to be sent to the server ////////
	let URL = "http://localhost:8000/drop.html";
	let data = "?=&iNdx=" + itemNdx;

	data += "&fdNdx=" + fridgesDirectIndex[value];
	data += "&num_items_accepted=" + foundFridgesList[value].num_items_accepted;
	data += "&can_accept_items=" + foundFridgesList[value].can_accept_items;
	data += "&i_quantity=" + foundFridgesList[value].items[itemNdx].quantity;

	sendData(URL, data);
	let message = document.getElementById("respArea");
	message.className = "";
	createViewResultsSec();

/////////////////////////////////////////////////////////////////////////////
	console.log(data);
}
function sendData(URL, data){
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = processData; // specify what should happen when the server sends a response
  xhttp.open("POST", URL, true); // open a connection to the server using the POST prot

  xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
  xhttp.send(data); // send the request to the server
}
//////////////////////////////////////////////////////////////////////////////////
/*function getSelectedOption(sel) {
        var opt;
        for ( var i = 0, len = sel.options.length; i < len; i++ ) {
            opt = sel.options[i];
            if ( opt.selected === true ) {
                break;
            }
        }
        return opt;
}*/
////////////////////////////////////////////////////////////////////////////////////
///////////////////////////////////////////// drop off items in fridges //////////////////
function addItemFrmPrep(){
	document.getElementById("item_name").addEventListener("input", checkFrmTxtFields);
  document.getElementById("item_type").addEventListener("input", checkFrmTxtFields);
  document.getElementById("item_image").addEventListener("input", checkFrmTxtFields);
	document.getElementById("submit_btn1").addEventListener("click", processAddItemFrm);

	//requestData("http://localhost:8000/js/comm-fridge-items.json");
}
function checkFrmTxtFields(event) {
	let message = document.getElementById("respArea");
	message.className = "hidden";

	checkFrmTxtComp();
}
function checkFrmTxtComp(){
  let iName = document.getElementById("item_name");
  let iType = document.getElementById("item_type");
  let iImage = document.getElementById("item_image");

	//let selectedItmNdx = gList.selectedIndex;
  let bt_sub = document.getElementById("submit_btn1");

  if(iName.value == '' || iType.value == '' || iImage.value == '') {
       bt_sub.disabled = true;
       return false;
     }
     bt_sub.disabled = false;
     return true;
}

function processAddItemFrm(event) {
  event.preventDefault();
  let iName = document.getElementById("item_name");
  let iType = document.getElementById("item_type");
  let iImage = document.getElementById("item_image");

  let URL = "http://localhost:8000/add_item.html";
  let data =  "?=&name=" + iName.value;
  data += "&type=" + iType.value;
  data += "&img="  + iImage.value;

  sendData(URL, data);
  let message = document.getElementById("respArea");
  message.textContent = iName.value + " was successfully added to the items list!";
  message.className = "";
}
//////////////////////////////add fridge in fridges //////////////////
//////////////// GET requests handling //////////////////////////////
// process data returned by the AJAX request
function getItems() {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
		let itemsList = JSON.parse(data);
    console.log(itemsList);
    addFridgeForm(itemsList);
  } else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
}
function getDataRequests(URL, dataProcessor){
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = dataProcessor; // specify what should happen when the server sends a response
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send(); // send the request to the server
}
//////////////////////// Add fridge //////////////////////////////////
function addFridgeFrmPrep(){
  ////////// get items list from the server///////
  let URL = "http://localhost:8000/fridges/items";
  getDataRequests(URL, getItems);
}
function addFridgeForm(itemsList){
  ////////////////////////////////////////////////
	document.getElementById("fridge_name").addEventListener("input", checkFrmTxtFields);
  document.getElementById("can_accept_items").addEventListener("input", checkFrmTxtFields);
  document.getElementById("contact_person").addEventListener("input", checkFrmTxtFields);
  document.getElementById("contact_phone").addEventListener("input", checkFrmTxtFields);
  document.getElementById("street").addEventListener("input", checkFrmTxtFields);
  document.getElementById("postal_code").addEventListener("input", checkFrmTxtFields);
  document.getElementById("city").addEventListener("input", checkFrmTxtFields);
  document.getElementById("province").addEventListener("input", checkFrmTxtFields);
	document.getElementById("submit_btn1").addEventListener("click", processAddFridgeFrm);
  document.getElementById("grocery_items").addEventListener("change", checkFrmTxtFields);
  populateGroceryTypes(itemsList);
	//requestData("http://localhost:8000/js/comm-fridge-items.json");
}
function populateGroceryItems(itemsList) {
	let i = 0;
  var nSelect = document.getElementById('grocery_items');
  let itemKeys = Object.keys(itemsList);
  console.log(itemKeys);
  for(let i = 0; i < itemKeys.length; i++) {
    var opt = document.createElement("option");
    opt.value= itemsList[itemKeys[i]].id;
    opt.innerHTML = itemsList[itemKeys[i]].name;
    nSelect.appendChild(opt);
  }
}
function populateGroceryTypes(itemsList) {
	let i = 0;
  var nSelect = document.getElementById('grocery_items');
  let itemKeys = Object.keys(itemsList);
  ///////////////////filter unique types of items //////////
  let uniqueTypes = [];
  for(let i = 0; i < itemKeys.length; i++) {
    if(uniqueTypes.indexOf(itemsList[itemKeys[i]].type) == -1) {
      uniqueTypes.push(itemsList[itemKeys[i]].type);
    }
  }
  ///////////////////////////////////////////////////////////
  for(let i = 0; i < uniqueTypes.length; i++) {
    var opt = document.createElement("option");
    opt.value= uniqueTypes[i];
    opt.innerHTML = uniqueTypes[i];
    nSelect.appendChild(opt);
  }
}
function checkFrmTxtFields(event) {
	let message = document.getElementById("respArea");
	message.className = "hidden";

	checkFrdgFrmTxt(event);
}
// function checkFrdgFrmTxt(event){
//   let element = event.target;
//   let form_fields = document.querySelectorAll("input");
//   let gList = document.getElementById("grocery_items");
//   let selectedItmNdx = gList.selectedIndex;
//   let bt_sub = document.getElementById("submit_btn1");
//   console.log(selectedItmNdx);
//
//   if(element.id == "fridge_name"){
//     if(!isAlpha(element.value)){
//       element.classList.add("error");
//       element.classList.remove("valid");
//       bt_sub.disabled = true;
//       return false;
//     }
//     else{
//       element.classList.add("valid");
//       element.classList.remove("error");
//     }
//   }
//   ////////////////////
//   if(element.id == "can_accept_items"){
//     if(isNaN(Number(element.value))){
//       element.classList.add("error");
//       element.classList.remove("valid");
//       bt_sub.disabled = true;
//       return false;
//     }
//     else{
//       element.classList.add("valid");
//       element.classList.remove("error");
//     }
//   }
//   ///////////////////////////////////
//   if(selectedItmNdx == -1) {
//     bt_sub.disabled = true;
//     return false;
//   }
//   ////////////////////
//   for(let i = 0; i < form_fields.length; i++) {
//     if(form_fields[i].value == '') {
//       bt_sub.disabled = true;
//       return false;
//     }
//   }
//   bt_sub.disabled = false;
//   return true;
// }
function isAlpha(strValue) {
  var letters = /^[A-Za-z ]+$/;
   if(strValue.match(letters)) {
      return true;
    } else {
      return false;
    }
}
function processAddFridgeFrm(event) {
  event.preventDefault();
/////////////////////////////////////////////////////////
let formData = document.querySelectorAll("input");
let gList = document.getElementById("grocery_items");
let selectedItmNdx = gList.selectedIndex;
console.log(formData);
let selected = [];
for (let option of gList.options)
{
    if (option.selected) {
        selected.push(option.value);
    }
}
let newFridge = {
  "name": formData[0].value,
  "can_accept_items": Number(formData[1].value),
  "accepted_types": selected,
  "contact_person": formData[2].value,
  "contact_phone": formData[3].value,
  "address": {
      "street": formData[4].value,
      "postal_code": formData[5].value,
      "city": formData[6].value,
      "province": formData[7].value
    }
  };
  console.log(newFridge);
////////// prepare to send the POST request ////////////////////
////// 1- prepare url
   let url = "http://localhost:8000/fridges";
   xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object

 // specify what should happen when the server sends a response back
 xhttp.onreadystatechange = function(){
 if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
   let message = document.getElementById("respArea");
   message.className = "";

   console.log("The category data was successfully updated!");
   console.log(xhttp.responseText);

 } else if(xhttp.status === 400){
     console.log(xhttp.responseText);
   } else if(xhttp.status === 404){
     console.log(xhttp.responseText);
   }
 };
 // open a connection to the server using the POST method
 xhttp.open("POST", url, true);
 // *** important: both POST and PUT expect a content-type to be set for the content. If this is missing, then the data will not be received on the server-side
 xhttp.setRequestHeader("Content-type","application/json");

 // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
 xhttp.setRequestHeader("Accept", "application/json");

 // *** important: the JSON object must be stringified before it is sent in the body of the response
 xhttp.send(JSON.stringify(newFridge)); // send the request to
}
//////////////////////////////////////////////////////////////
////////////////////////// edit fridge ///////////////////////
/////////////////////////////////////////////////////////////

function editFridge(fridgeId) {
  localStorage.setItem('fridgeId', fridgeId);
  window.location.href = "/fridges/editFridge";
}
function loadFridgeDataForm() {
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = editFridgeData; // specify what should happen when the server sends a response
  let fridgeId = localStorage.getItem('fridgeId');
  console.log(fridgeId);

  let URL = "http://localhost:8000/fridges/" + fridgeId;
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "application/json");
  //xhttp.setRequestHeader("Accept", "text/html");
  xhttp.send(); // send the request to the server

}
function editFridgeData(){
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
			fridge = JSON.parse(data);
			console.log(fridge);
      editFridgeFrmPrep();
      fillEditFridgeForm(fridge);
  } else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
}
var selectedTypes = [];
function fillEditFridgeForm(fridge) {
  let formData = document.querySelectorAll("input");
  let acceptedTypes = document.getElementById("fridge_items");
  console.log(formData);
  formData[0].value = fridge.name;
  formData[1].value = fridge.num_items_accepted;
  console.log(fridge);
  let allTypes = "{~  ";
  for(let i = 0; i < fridge.accepted_types.length; i++) {
    allTypes += fridge.accepted_types[i] + " ~ ";
    selectedTypes.push(fridge.accepted_types[i]);
  }
  allTypes += "}";
  acceptedTypes.innerHTML = allTypes;
  formData[2].value = fridge.contact_person;
  formData[3].value = fridge.contact_phone;
  formData[4].value = fridge.address.street;
  formData[5].value = fridge.address.postal_code;
  formData[6].value = fridge.address.city;
  formData[7].value = fridge.address.province;
  let bt_sub = document.getElementById("submit_btn1");
  bt_sub.disabled = false;
}
function editFridgeFrmPrep(){
  ////////// get items list from the server///////
  URL = "http://localhost:8000/fridges/items";
  getDataRequests(URL, getItemsEditFridge);
}
function getItemsEditFridge() {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
		let itemsList = JSON.parse(data);
    console.log(itemsList);
    editFridgeForm(itemsList);
  } else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
}

function editFridgeForm(itemsList){
  ////////////////////////////////////////////////
	document.getElementById("fridge_name").addEventListener("input", checkFrmTxtFields);
  document.getElementById("can_accept_items").addEventListener("input", checkFrmTxtFields);
  document.getElementById("contact_person").addEventListener("input", checkFrmTxtFields);
  document.getElementById("contact_phone").addEventListener("input", checkFrmTxtFields);
  document.getElementById("street").addEventListener("input", checkFrmTxtFields);
  document.getElementById("postal_code").addEventListener("input", checkFrmTxtFields);
  document.getElementById("city").addEventListener("input", checkFrmTxtFields);
  document.getElementById("province").addEventListener("input", checkFrmTxtFields);
	document.getElementById("submit_btn1").addEventListener("click", processEditFridgeFrm);
  document.getElementById("grocery_items").addEventListener("change", checkFrmTxtFields);
  populateGroceryTypes(itemsList);
	//requestData("http://localhost:8000/js/comm-fridge-items.json");
}
// function populateGroceryTypes(itemsList) {
// 	let i = 0;
//   var nSelect = document.getElementById('grocery_items');
//   let itemKeys = Object.keys(itemsList);
//   ///////////////////filter unique types of items //////////
//   let uniqueTypes = [];
//   for(let i = 0; i < itemKeys.length; i++) {
//     if(uniqueTypes.indexOf(itemsList[itemKeys[i]].type) == -1) {
//       uniqueTypes.push(itemsList[itemKeys[i]].type);
//     }
//   }
//   ///////////////////////////////////////////////////////////
//   for(let i = 0; i < uniqueTypes.length; i++) {
//     var opt = document.createElement("option");
//     opt.value= uniqueTypes[i];
//     opt.innerHTML = uniqueTypes[i];
//     nSelect.appendChild(opt);
//   }
// }
// function checkFrmTxtFields(event) {
// 	let message = document.getElementById("respArea");
// 	message.className = "hidden";
//
// 	checkFrdgFrmTxt(event);
// }
function checkFrdgFrmTxt(event){
  let element = event.target;
  let form_fields = document.querySelectorAll("input");
  let gList = document.getElementById("grocery_items");
  let selectedItmNdx = gList.selectedIndex;
  let bt_sub = document.getElementById("submit_btn1");
  console.log(selectedItmNdx);

  if(element.id == "fridge_name"){
    if(!isAlpha(element.value)){
      console.log(element.value);
      element.classList.add("error");
      element.classList.remove("valid");
      bt_sub.disabled = true;
      return false;
    }
    else{
      element.classList.add("valid");
      element.classList.remove("error");
    }
  }
  ////////////////////
  if(element.id == "can_accept_items"){
    if(isNaN(Number(element.value))){
      element.classList.add("error");
      element.classList.remove("valid");
      bt_sub.disabled = true;
      return false;
    }
    else{
      element.classList.add("valid");
      element.classList.remove("error");
    }
  }
  ///////////////////////////////////
  if(selectedItmNdx == -1 && selectedTypes.length == 0) {
    bt_sub.disabled = true;
    return false;
  }
  ////////////////////
  for(let i = 0; i < form_fields.length; i++) {
    if(form_fields[i].value == '') {
      bt_sub.disabled = true;
      return false;
    }
  }
  bt_sub.disabled = false;
  return true;
}
function processEditFridgeFrm(event) {
  event.preventDefault();
/////////////////////////////////////////////////////////
  let formData = document.querySelectorAll("input");
  let gList = document.getElementById("grocery_items");
  //let selectedItmNdx = gList.selectedIndex;
  console.log(formData);
  let selected = [];
  for (let option of gList.options)
  {
      if (option.selected) {
          selected.push(option.value);
      }
  }
  if(selected.length == 0) {
    selected = selectedTypes ;
  }
  selectedTypes = [];
  let newFridge = {
    "name": formData[0].value,
    "num_items_accepted": Number(formData[1].value),
    "accepted_types": selected,
    "contact_person": formData[2].value,
    "contact_phone": formData[3].value,
    "address": {
        "street": formData[4].value,
        "postal_code": formData[5].value,
        "city": formData[6].value,
        "province": formData[7].value
      }
    };
  console.log(newFridge);
////////// prepare to send the PUT request ////////////////////
////// 1- prepare url
   let fridgeId = localStorage.getItem('fridgeId');
   let url = "http://localhost:8000/fridges/" + fridgeId;

   xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object

 // specify what should happen when the server sends a response back
 xhttp.onreadystatechange = function(){
 if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
   let message = document.getElementById("respArea");
   message.className = "";

   console.log("The category data was successfully updated!");
   console.log(xhttp.responseText);

 } else if(xhttp.status === 400){
     console.log(xhttp.responseText);
   } else if(xhttp.status === 404){
     console.log(xhttp.responseText);
   }
 };
 // open a connection to the server using the POST method
 xhttp.open("PUT", url, true);
 // *** important: both POST and PUT expect a content-type to be set for the content. If this is missing, then the data will not be received on the server-side
 xhttp.setRequestHeader("Content-type","application/json");

 // *** important: if this header is not set, then the server would not be able to use the "Accept" header value to determine the type of resources to respond with
 xhttp.setRequestHeader("Accept", "application/json");

 // *** important: the JSON object must be stringified before it is sent in the body of the response
 xhttp.send(JSON.stringify(newFridge)); // send the request to
}
////////////////////////////////////////////////////////////////////////
/////////////////////////// search screen  ///////////////
////////////////////////////////////////////////////////////////////////
function searchItemFrmPrep(){

	// document.getElementById("submit_btn1").addEventListener("click", processAddItemFrm);
  document.getElementById("submit_btn_search").addEventListener("click", processSearchItemFrm);

	//requestData("http://localhost:8000/js/comm-fridge-items.json");
}
function processSearchItemFrm(envet) {
  event.preventDefault();
  let iName = document.getElementById("item_name");
  let iType = document.getElementById("item_type");

  let URL = "http://localhost:8000/search/items?";
  URL += "type=" + iType.value;
  URL += "&name=" + iName.value;

  sendSearchData(URL, getSearchResults); // using query parameters
  // let message = document.getElementById("respArea");
  // message.textContent = iName.value + " was successfully added to the items list!";
  // message.className = "";
}

function sendSearchData(URL, getSearchResults) {
  xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = getSearchResults; // specify what should happen when the server sends a response

  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.setRequestHeader("Accept", "application/json");
  xhttp.send(); // send the request to the server

}
function getSearchResults() {
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
    let searchResult = JSON.parse(data);
      console.log(searchResult);
    } else {
    console.log(xhttp.readyState + "---" + xhttp.status);
    console.log("There was a problem with the request.");
  }
}

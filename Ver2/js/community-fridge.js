var xhttp; // variable to store the XMLHttpRequest object
var groceries = null;
var fridgesList = null;
var foundFridgesList = [];
var fridgesDirectIndex = [];
var flag = 0;
/////////////////////////////////////////////////////////////
var fridgeNumber = 0;
let categories = {};
/////////////////////////////////////////////////////////////
function prepFridges() {
  flag = 1;
  requestData("http://localhost:8000/js/comm-fridge-data.json");
}
function loadFridges(){
let fridge_menu = document.getElementById('fridge_menu');
let i = 0;
for(i = 0; i < fridgesList.length; i++){
  // creating fridge list item
    let frdg_lst_item = document.createElement("li");
    frdg_lst_item.className = "menu_item";
    frdg_lst_item.id =  "menu_item";
    frdg_lst_item.value = i;
    //frdg_lst_item.onclick = "showFridge(value)";
    frdg_lst_item.setAttribute("onclick", "showFridge(value)");
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
    //frdg_p.value = i;
    frdg_rec.appendChild(frdg_p);
    ///////////////////////////////////////
    frdg_link.appendChild(frdg_rec);
    frdg_lst_item.appendChild(frdg_link);
    fridge_menu.appendChild(frdg_lst_item);
  }
}
/////////////////////////////////////////////////////
function showFridge(frdg_num){
///////////////////////////////////////////////
fridgeNumber = frdg_num;
////////////////////////////////////////////////////////////

  var flsec_elem = document.getElementById("frdg_list_sec");
  var fisec_elem = document.getElementById("frdge_all_info_sec");
  ////////////////////// Header ////////////
  var head = document.createElement("h1");
  head.className = "home_h1";
  head.id = "frdg_h1";
  let value = "Items in the " + fridgesList[frdg_num].name;
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
  naclist_item.textContent = fridgesList[frdg_num].name;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  naclist_item.textContent = fridgesList[frdg_num].address.street;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  naclist_item.textContent = fridgesList[frdg_num].contact_phone;
  naclist.appendChild(naclist_item);

  naclist_item = document.createElement("li");
  let prog = document.createElement("progress");
  prog.className = "meter";
  prog.id = "file";
  prog.value = fridgesList[frdg_num].capacity;
  prog.max = "100";
  prog.textContent = fridgesList[frdg_num].capacity + "%";
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

  for(i = 0; i < fridgesList[frdg_num].items.length; i++) {
    if(flags[fridgesList[frdg_num].items[i].type]) continue;

      flags[fridgesList[frdg_num].items[i].type] = true;
      categories[fridgesList[frdg_num].items[i].type] = 0;

  }
  //categories.push(cType);
  console.log(categories);
//////////// sums for each category ////////////////
  for(i = 0; i < fridgesList[frdg_num].items.length; i++) {
    let tname = fridgesList[frdg_num].items[i].type;
    categories[tname] += fridgesList[frdg_num].items[i].quantity;
  }
  console.log (categories);
  let cats = Object.keys( categories );
  let catLen = Object.keys( categories ).length;
  for(let cat = 0;  cat < catLen; cat++) {
    naclist_item = document.createElement("li");
    naclist_item.className = "frdg_cat_lst_itm";
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
  for (itm = 0; itm < fridgesList[frdg_num].items.length; itm++) {

  let row = document.createElement("tr");
  row.className = "item_row";
  let imgCell = document.createElement("td");
  let item_img = document.createElement("img");
  item_img.className = "item_img";

  item_img.src = fridgesList[frdg_num].items[itm].img;
  item_img.alt = fridgesList[frdg_num].items[itm].name;
  imgCell.appendChild(item_img);
  row.appendChild(imgCell);

  let item_info = document.createElement("td");
  item_info.className = "item_info";
  let pinfo = document.createElement("p");
  pinfo.textContent = fridgesList[frdg_num].items[itm].name;
  item_info.appendChild(pinfo);
  pinfo = document.createElement("p");
  pinfo.textContent = "Quantity: " + fridgesList[frdg_num].items[itm].quantity;
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
  btn.id = fridgesList[frdg_num].items[itm].name; //itemNames[itm];
  //fridges[frdg_num].items[itemNames[0]];
  btn.setAttribute("onclick", "increment(id)");
  btn.textContent = "+";
  amount.appendChild(btn);
  let labcount = document.createElement("label");
  labcount.className = "counter" ;
  labcount.id = fridgesList[frdg_num].items[itm].name + "-counter";//"counter";
  labcount.textContent = "0";
  amount.appendChild(labcount);

  btn = document.createElement("button");
  btn.className = "btn_dec";
  btn.id = fridgesList[frdg_num].items[itm].name; //itemNames[itm];
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
function increment(itemid){
  //fridges[fridgeNumber].items[itemid].name;

  let cartItemsDiv = document.getElementById('cart_items');
  let filteredArray = Object.values(fridgesList[fridgeNumber].items).filter(invent => invent.name == itemid);
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
    citems.id = filteredArray[0].name + "-cart";
    quant.textContent = total;
    citems.textContent = quant.textContent + " X " + filteredArray[0].name;

  } else {
    quant.textContent = total;
    citems.textContent = quant.textContent + " X " + filteredArray[0].name;
  }
  cartItemsDiv.appendChild(citems);
  //console.log(fridges[fridgeNumber].items[itemid].name);
}
function decrement(itemid){

  let cartItemsDiv = document.getElementById('cart_items');
  let filteredArray = Object.values(fridgesList[fridgeNumber].items).filter(invent => invent.name == itemid);
  //console.log(filteredArray[0]);
  let citems = document.getElementById(itemid + "-cart");

  let quant = document.getElementById(itemid + "-counter");
  if (Number(quant.textContent) === 0){
    return;
  }
  let total = Number(quant.textContent);
  total--;
  if(citems == null) {
    citems = document.createElement("p");
    citems.id = filteredArray[0].name + "-cart";
    quant.textContent = total;
    citems.textContent = quant.textContent + " X " + filteredArray[0].name;

  } else {
    if(total > 0) {
      quant.textContent = total;
      citems.textContent = quant.textContent + " X " + filteredArray[0].name;
      cartItemsDiv.appendChild(citems);
    } else {
      console.log(total);
      citems.parentNode.removeChild(citems);
    }
  }

}
function catFilter(catNum) {
  //console.log(catNum);
//  let itemNames = ["almond_milk", "whole_milk", "salted_butter", "grapes", "apples", "bananas", "spinach",
  //								"lettuce", "cauliflower", "cheerios", "crackers"];
  //////////////////////////////////////////////////////////////
  let cats = Object.keys( categories );
  //let catLen = Object.keys( categories ).length;

  let filteredArray = Object.values(fridgesList[fridgeNumber].items).filter(invent => invent.type == cats[catNum]);
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
  item_img.src = filteredArray[itm].img;
  item_img.alt = filteredArray[itm].name;
  imgCell.appendChild(item_img);
  row.appendChild(imgCell);

  let item_info = document.createElement("td");
  item_info.className = "item_info";
  let pinfo = document.createElement("p");
  pinfo.textContent = filteredArray[itm].name;
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
  btn.id = filteredArray[itm].name; //itemNames[itm];
  //fridges[frdg_num].items[itemNames[0]];
  btn.setAttribute("onclick", "increment(id)");
  btn.textContent = "+";
  amount.appendChild(btn);
  let labcount = document.createElement("label");
  labcount.className = "counter" ;
  labcount.id = filteredArray[itm].name + "-counter";//"counter";
  labcount.textContent = "0";
  amount.appendChild(labcount);

  btn = document.createElement("button");
  btn.className = "btn_dec";
  btn.id = filteredArray[itm].name; //itemNames[itm];
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
function requestData(URL){
	xhttp = new XMLHttpRequest(); // create a new XMLHttpRequest object
	xhttp.onreadystatechange = processData; // specify what should happen when the server sends a response
  xhttp.open("GET", URL, true); // open a connection to the server using the GET protocol
  xhttp.send(); // send the request to the server
}

// process data returned by the AJAX request
function processData(){
  if (xhttp.readyState === XMLHttpRequest.DONE && xhttp.status === 200) {
    let data = xhttp.responseText;  // Data returned by the AJAX request
		//console.log(xhttp);
		if(xhttp.responseURL.indexOf("comm-fridge-items.json") > -1) {
			groceries = JSON.parse(data);  // Convert the JSON data to a JavaScript object
	    //console.log(groceries); // print the object, so we can see the fields
	    populateGroceryItems(); // use the groceries object to populate the DOM for the table
		}
		else if (xhttp.responseURL.indexOf("comm-fridge-data.json") > -1) {
			fridgesList = JSON.parse(data);
			console.log(fridgesList);
      if(flag === 1) {
        loadFridges();
      } else if(flag === 2) {
        findFridges();
      }
		}
  }
  else {
		console.log(xhttp.readyState + "---" + xhttp.status);
		console.log("There was a problem with the request.");
	}
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
  let nItems = document.getElementById("number_items");
	let selectedItmNdx = gList.selectedIndex;
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

function populateGroceryItems() {
	let i = 0;
  var nSelect = document.getElementById('grocery_items');

  for(i = 0; i < groceries.length; i++){
     var opt = document.createElement("option");
     opt.value= groceries[i].name;
     opt.innerHTML = groceries[i].name;
     /*if(i == 0){
       opt.selected="selected";
     }*/
     nSelect.appendChild(opt);
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

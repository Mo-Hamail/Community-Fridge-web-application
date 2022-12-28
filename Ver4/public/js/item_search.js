var xhttp; // variable to store the XMLHttpRequest object

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

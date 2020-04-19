/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 08/04/2020
********************************************/

/*************Global Variables**************/
let collabooksMap;
let markers = initMarkers();
let chat = chatFunctions();

/************* Initializations **************/
function initMap(){
  collabooksMap = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.078113, lng: -114.129029},
      zoom: 13
    });
    populateMap();
}

//on document load do
$(document).ready(function(){
  populateShelf();
  populateBooksAround();
  initMap();

  //check if admin


});

/************* Google maps functions ********/
//creating a closure that will handle all of the marker functions
function initMarkers(){
  let bookIcon = 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png';
  //list of markers, needed to keep track of them
  let markers = [];
  function addUserMarker(user){
    let markerPosition = {lat:user.user_lon, lng:user.user_lat};
    let marker = new google.maps.Marker({position:markerPosition, map:collabooksMap, icon: bookIcon});
    //This string will change once we know more about what information we want to show
    let userInfo = "<b>User Id:</b> " + user.user_id;
    let infoWindow = new google.maps.InfoWindow({content: userInfo});
    marker.addListener("click", function(){
      infoWindow.open(map, marker);
    });
    markers[user.user_id] = {user: user, marker:marker, infoWindow:infoWindow, books:[]};
  }

  function addBookToUser(userId, book){
    markers[userId].books.push(book);
  }

  function setInfoWindows(){
    for (markerIndex in markers){
      updateInfoWindow(markerIndex);
    }
  }

  function updateInfoWindow(userId){
    infoString = "<h4>User:</h4><b>User: </b>" + markers[userId].user.first_name +  " "+markers[userId].user.last_name + "<h4>User's books:</h4>";
    for(currentBook of markers[userId].books){
      infoString = infoString + "<hr><b>Title: </b>"+currentBook.title+"<br><b>Author: </b>"+currentBook.author
                              +"<br><b>Genre: </b>"+currentBook.genre;
      //Only adding the button to rent a book if it is currently available
      if(currentBook.borrowed_by === "null"){
        //when the button is pressed it will call the function loanHandler with the book identifiers as an argument
        infoString = infoString + "<br><b>Availability:</b> Available"+ "<br><button type='button' onclick='loanHandler("
                                +currentBook.owner_id+")' class='loanButton'>Ask to loan</button>";
      }
      else{
        infoString = infoString + "<br><b>Availability:</b> Unavailable";
      }
    }
    markers[userId].infoWindow.setContent(infoString);
  }


  function removeMarker(id){
    markers[id].marker.setMap(null);
    markers[id].marker = null;
    markers[id] = null;
  }

  function modifyBook(userId, newBookInfo){
    for(let bookToChange of markers[userId].books){
      if(parseInt(bookToChange.book_id) === newBookInfo.book_id){
        Object.assign(bookToChange, newBookInfo);
        break;
      }
    }
    updateInfoWindow(userId);
  }

  function removeBook(ownerId, bookId){
    for(let bookIndex in markers[ownerId].books){
      if(parseInt(markers[ownerId].books[bookIndex].book_id) === bookId){
        markers[ownerId].books.splice(bookIndex,1);
        break;
      }
    }
    updateInfoWindow(ownerId);
  }

  function clearMap(){
    console.log('inside internal market clearMap');
    for (let i=1; i < markers.length; i++) {
        markers[i].marker = null;
    }
  }

  // Sets the map on all markers in the array.
  function setMapOnAll(map) {
    for (var i = 1; i < markers.length; i++) {
      markers[i].marker.setMap(map);
    }
  }

  function clearMarkers() {
    setMapOnAll(null);
  }

// Deletes all markers in the array by removing references to them.
  function deleteMarkers() {
    clearMarkers();
    markers = [];
  }

  function selectiveHide(searchword){
      // console.log('the searchword is:'+searchword);
      for (var i = 1; i < markers.length; i++) {
        let thismarker = markers[i];
        let bookarray = markers[i].books;
        // console.log(bookarray);
        let hideme = true;

        bookarray.forEach(function(arrayItem){
              //console.log(arrayItem)
              let bookrecord = arrayItem;
              let bookrecordvalues = Object.values(bookrecord);
              //console.log(typeof bookrecordvalues)
              //console.log(bookrecordvalues);
              for (const val of bookrecordvalues) {
                if (val.toLowerCase().includes(searchword.toLowerCase() ) ) {
                  //console.log(val);
                  hideme = false;
                  //
                } else {
                  //console.log(val+': this val does not have the search word');
                  //markerid = hide
                }
              }
        });
        // console.log('the bool value is:'+hideme);
        if (Boolean(hideme)) {
          thismarker.marker.setMap(null);
        }
      }
  }


  return {
    addUserMarker, addBookToUser, setInfoWindows, removeMarker, modifyBook, removeBook, clearMap, deleteMarkers,
    setMapOnAll, clearMarkers, deleteMarkers, selectiveHide
  };
}

/************* Event Handling functions *****/
//this function currently has placeholder functionality
function loanHandler(identifier){
  let ownerId = identifier;
  let currentId = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");;
  $('.HomePage').hide();
  $('.BookshelfPage').hide();
  $('.RequestsPage').show();
  $('.AdminPage').hide();
  console.log("called loan handler asking to borrow book#"+identifier);
  chat.addRoom(currentId, ownerId);
}

/************* Page Navigation **************/

/**Changes to the selected tab on the navbar**/
$(document).on('click','.nav li', function (e) {
    $(this).addClass('active').siblings().removeClass('active');

    if ($(this).text() === "Home") {
      $('.HomePage').show();
      $('.BookshelfPage').hide();
      $('.RequestsPage').hide();
      $('.AdminPage').hide();
    }
    else if ($(this).text() === "Bookshelf") {
      $('.HomePage').hide();
      $('.BookshelfPage').show();
      $('.RequestsPage').hide();
      $('.AdminPage').hide();
    }
    else if ($(this).text() === "Requests") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').show();
      $('.AdminPage').hide();
    }
    else if ($(this).text() === "Admin") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').hide();
      $('.AdminPage').show();
    }

} );

/************* Bookshelf Functions **************/

async function populateShelf()
{
  $('#bookshelf tbody').empty();
  $('#lendBookDropdown').empty();
  $('#returnBookDropdown').empty();

  // TODO: Use cookies to keep track of current user?
  const currentUser = "18";

  const allBooks = await apiGetBookTable();

  for(var key in allBooks) {

    var owner = allBooks[key].owner_id;

    if(owner === currentUser){

      let status = allBooks[key].borrowed_by;

      if(status === "null"){
        status = "None";
      }

      //populate the current users bookshelf
      $('#bookshelf > tbody').append($('<tr>').html(
        "<td>" + allBooks[key].title + "</td>" +
        "<td>" + allBooks[key].author + "</td>" +
        "<td>" + allBooks[key].isbn + "</td>" +
        "<td>" + status + "</td>" +
        "<td>" + '<button type="button" class="btn btn-secondary" id="removeBookButton" onclick="removeBook(' +allBooks[key].book_id+ ')">Remove</button>' + "</td>"
        ));

      //also populate books that can be returned and lent in Requests
      if(allBooks[key].borrowed_by === "null" ){
        $('#lendBookDropdown').append('<option value=' + allBooks[key].book_id + '>' + allBooks[key].title + '</option>');
      }
      if(allBooks[key].borrowed_by !== "null" ){
        $('#returnBookDropdown').append('<option value=' + allBooks[key].book_id + '>' + allBooks[key].title + '</option>');
      }
    }
  }

  if($("#lendBookDropdown option").length == 0){
      $('#lendButton').addClass('disabled');
  }else{
      $('#lendButton').removeClass('disabled');
  }

  if($("#returnBookDropdown option").length == 0){
      $('#returnButton').addClass('disabled');
  }else{
      $('#returnButton').removeClass('disabled');
  }

}

async function removeBook(removeKey){

  console.log("removed " + removeKey);
  let record_to_delete ={
      "tablename" : "book_table",
      "column_name" : "book_id",
      "value" : removeKey,
  };
  await apiDeleteRecord(record_to_delete);

  //make the new page up to date
  populateShelf();
}

async function addBook(){
  let titleInput = $("#inputTitle").val();
  let authorInput = $("#inputAuthor").val();
  let isbnInput = $("#inputISBN").val();
  let genreInput = $("#inputGenre").val();
  //will need to get current user for owner_id
  let owner = 90;
  if (titleInput === "" || authorInput === "" || isbnInput === "" || genreInput === "Select Genre..."){
    alert("All fields must be entered to add a book");
    return;
  }
  const allBooks = await apiGetBookTable();
  //getting the next Id for the book, since the DB is kind of weird it has to be done this way
  let maxId = 0;
  for(let book of allBooks){
    if(parseInt(book.book_id) > maxId){
      maxId = parseInt(book.book_id);
    }
  }
  maxId = maxId + 1;
  let bookToAdd = {
    "bookid":maxId,
    "title":titleInput,
    "author":authorInput,
    "isbn":isbnInput,
    "genre":genreInput,
    "owner_id":owner,
    "borrowed_by":"null",
    "due_date":"null"
  };
  apiAddRecordToTable(bookToAdd, 'book');
  $("#inputTitle").val("");
  $("#inputAuthor").val("");
  $("#inputISBN").val("");
  $("#inputGenre").val("Select Genre...");

  $('#errorMessage').text("The book " + titleInput + " was added successfully!");
  $('#alertDialog').modal('show');
}

/************* Chat Functions **************/

async function lendABook(){

  if($("#lendBookDropdown option").length > 0){

    let bookToLendTitle = $("#lendBookDropdown option:selected" ).text();
    let bookToLend = $("#lendBookDropdown option:selected" ).val();

    //TODO: how do i get this?
    let personWhoBorrows = "13";

    //Change status in the DB
    let updateuserrecord = { "tablename" : "book_table",
        "cell_d" : "borrowed_by",
        "cell_v" : personWhoBorrows,
        "where_d" : "book_id",
        "where_v" : bookToLend
    };
    await apiUpdateRecord(updateuserrecord);

    //Update the shelf & map
    populateShelf();
    populateMap();
  }
}

//***Returns the selected book back to the current user***
async function returnABook(){

  if($("#returnBookDropdown option").length > 0){

    let bookToReturnTitle = $("#returnBookDropdown option:selected" ).text();
    let bookToReturn = $("#returnBookDropdown option:selected" ).val();

    //Change status in the DB
    let updateuserrecord = { "tablename" : "book_table",
        "cell_d" : "borrowed_by",
        "cell_v" : "null",
        "where_d" : "book_id",
        "where_v" : bookToReturn
    };
    await apiUpdateRecord(updateuserrecord);

    //Update the shelf/map
    populateShelf();
    populateMap();
  }
}

/************* Main Page Functions **************/

async function populateMap()
{
  const users = await apiGetUserTable();

  for(let userToAdd of users){
    // un-comment to see the record structure
    //console.log(userToAdd);
    markers.addUserMarker(userToAdd);
  }

  const books = await apiGetBookTable();
  for(let bookToAdd of books){
    markers.addBookToUser(bookToAdd.owner_id, bookToAdd);
  }

  markers.setInfoWindows();
}

async function populateBooksAround()
{
  const allBooks = await apiGetBookTable();
  const allUsers = await apiGetUserTable();

  /*HARDCODED LAT AND LON. GET FROM COOKIES TODO*/
  const curr_lon = 50.93974967;
  const curr_lat = -113.9596893;

  //Only show 10 books alternatively allBooks.length
  for(let key = 0; key < allBooks.length; key++){

    //Get the books owner id from the book table.
    const owned_by = allBooks[key].owner_id;

    var curr_owner = allUsers.filter(obj => {
      return obj.user_id == owned_by
    });

    book_lat = curr_owner[0].user_lat;
    book_lon = curr_owner[0].user_lon;

    //Calculate the distance, Haversine method, accurate within .5%, then add the property
    var r = 6371000;
    var phi_1 = curr_lat * (Math.PI / 180);
    var phi_2 = book_lat * (Math.PI / 180);

    var delta_phi = (book_lat - curr_lat) * (Math.PI / 180);
    var delta_lambda = (book_lon - curr_lon) * (Math.PI / 180);

    var a = Math.sin(delta_phi/2.0)**2+ Math.cos(phi_1)*Math.cos(phi_2)* Math.sin(delta_lambda/2.0)**2;
    var c = 2*Math.atan2(Math.sqrt(a),Math.sqrt(1-a));

    spacingInKilometers = (r*c)/1000;
    allBooks[key].distance = spacingInKilometers.toFixed(1);

    /*console.log("TEST");
    console.log(curr_lat);
    console.log(curr_lon);
    console.log(book_lat);
    console.log(book_lon);
    console.log(spacingInKilometers);*/
  }

  allBooks.sort(function(a, b){
    return a.distance-b.distance
  });

  var nearbyBookCount = 0;
  for(let key = 0; key < allBooks.length; key++) {
  // Beware if you use the below for statement
  // for(var key in allBooks) {
    if(allBooks[key].borrowed_by === "null" && allBooks[key].distance != 0 && nearbyBookCount <= 20){
      $('#booksidebar > tbody').append($('<tr>').html(
        "<td>" + allBooks[key].title + "</td>" +
        "<td>" + allBooks[key].author + " (" + allBooks[key].distance + "km away)</td>"
        ));
      nearbyBookCount++;
    }
  }
}

function searchQuery(){
  let query = document.getElementById('searchInput').value;
  // console.log(query);
  markers.selectiveHide(query);
}

// this function will be executed on click of X (clear button)
$('input[type=search]').on('search', function () {
  populateMap();

});

/************* Admin Functions **************/
async function checkIfNotBanned(idToCheck)
{
  const allUsers = await apiGetUserTable();

  for(var key in allUsers) {
    if(allUsers[key].user_id === parseInt(idToCheck)){
      if(allUsers[key].status == "active"){
        return "Ban";
      }else{
        return "Unban";
      }
    }
  }
}

async function banUserA()
{
  let idToBan = $(banFirstUser).val();

  //if the user is not banned
  if($('#banFirstUser').text().search("Unban") === -1){

    //Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'banned',
        "where_d" : "user_id",
        "where_v" : parseInt(idToBan),
    };

    await apiUpdateRecord(updateuserrecord);

    //update the screen
    $('#banFirstUser').text("Unban user_" + idToBan);
  }else{

    //Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'active',
        "where_d" : "user_id",
        "where_v" : idToBan,
    };

    await apiUpdateRecord(updateuserrecord);

    //update the screen
    $('#banFirstUser').text("Ban user_" + idToBan);
  }
}

async function banUserB()
{
  let idToBan = $(banSecondUser).val();

  //if the user is not banned
  if($('#banSecondUser').text().search("Unban") === -1){

    //Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'banned',
        "where_d" : "user_id",
        "where_v" : parseInt(idToBan),
    };

    await apiUpdateRecord(updateuserrecord);

    //update the screen
    $('#banSecondUser').text("Unban user_" + idToBan);
  }else{
    //Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'active',
        "where_d" : "user_id",
        "where_v" : idToBan,
    };

    await apiUpdateRecord(updateuserrecord);

    //update the screen
    $('#banSecondUser').text("Ban user_" + idToBan);
  }
}

/************************** SENG513 Final Project ***************************
       _____ ____  _      _               ____   ____   ____  _  __ _____
     / ____/ __ \| |    | |        /\   |  _ \ / __ \ / __ \| |/ // ____|
    | |   | |  | | |    | |       /  \  | |_) | |  | | |  | | ' /| (___
    | |   | |  | | |    | |      / /\ \ |  _ <| |  | | |  | |  <  \___ \
    | |___| |__| | |____| |____ / ____ \| |_) | |__| | |__| | . \ ____) |
    \_____\____/|______|______/_/    \_|____/ \____/ \____/|_|\_|_____/

            ______......-----~~~~~~~--..__   __..--~~~~~~~-----......______
          //   Members:                   `V'                            \\
        //        Jasmine Cronin          |           Ashley Millette    \\
      //       Brandt Davis              |         Siobhan O’Dell        \\
    //     Patrick Matchett             |        Kent Wong               \\
  //_______......------~~~~~~~~--..__  | __..--~~~~~~~~-----......_______\\
//_______..........------~~~~~~...__\ | /__...~~~~~~------........_______\\
===================================\\|//===================================
                                  `----`
                          Created On: 11/03/2020
                        Last revision: 19/04/2020
****************************************************************************/

/*************Global Variables**************/
let collabooksMap;
let markers = initMarkers();
let admin = false;

/************* Initializations **************/
function initMap(){
  let mapCenter;
  if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_lat')).length &&
      document.cookie.split(';').filter((item) => item.trim().startsWith('user_lon')).length) {
        let user_lat = parseFloat(document.cookie.replace(/(?:(?:^|.*;\s*)user_lat\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        let user_lon = parseFloat(document.cookie.replace(/(?:(?:^|.*;\s*)user_lon\s*\=\s*([^;]*).*$)|^.*$/, "$1"));
        mapCenter = {lat:user_lat, lng:user_lon};
  }
  else{
    mapCenter = {lat: 51.078113, lng: -114.129029};
  }
  collabooksMap = new google.maps.Map(document.getElementById('map'), {
      center: mapCenter,
      zoom: 13
    });
    populateMap();
}

//on document load, do these fucntions
$(document).ready(function(){
  populateShelf();
  populateBooksAround();
  initMap();

  //check if admin, show admin tab if they are
  if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_type=')).length) {
      let userType = document.cookie.replace(/(?:(?:^|.*;\s*)user_type\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      if(userType === "admin"){
        admin = true;
        $("a:hidden").show();
      }else{
        admin = false;
      }
  }
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

  function addOwnLocation(user){
    let markerPosition = {lat:user.user_lon, lng:user.user_lat};
    let marker = new google.maps.Marker({position:markerPosition, map:collabooksMap});
    //This string will change once we know more about what information we want to show
    let userInfo = "<h3>Your Location</h3>";
    let infoWindow = new google.maps.InfoWindow({content: userInfo});
    marker.addListener("click", function(){
      infoWindow.open(map, marker);
    });
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
    infoString = "<h4>User: " + markers[userId].user.first_name +  " "+markers[userId].user.last_name + "</h4><h4>User's books:</h4>";
    for(currentBook of markers[userId].books){
      infoString = infoString + "<hr><b>Title: </b>"+currentBook.title+"<br><b>Author: </b>"+currentBook.author
                              +"<br><b>Genre: </b>"+currentBook.genre;
      //Only adding the button to rent a book if it is currently available
      if(currentBook.borrowed_by === "null"){
        //when the button is pressed it will call the function loanHandler with the book identifiers as an argument
        infoString = infoString + "<br><b>Availability:</b> Available"+ "<br><button type='button' onclick='loanHandler("
                                +currentBook.book_id+")' class='loanButton'>Ask to loan</button>";
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
      if(markers[i] === undefined || markers[i] === null){
        continue;
      }
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
      //console.log('the searchword is:'+searchword);
      for (var i = 1; i < markers.length; i++) {
        if(markers[i] === undefined || markers[i] === null){
          continue;
        }
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
                  //console.log(bookrecord);
                    $('#booksidebar > tbody').append($('<tr>').html(
                        "<td>" + bookrecord.title + "</td>" +
                        "<td>" + bookrecord.author + "</td>"
                    ));
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
        else{
          thismarker.marker.setMap(collabooksMap);
        }
      }
  }


  return {
    addUserMarker, addBookToUser, setInfoWindows, removeMarker, modifyBook, removeBook, clearMap,
    setMapOnAll, clearMarkers, deleteMarkers, selectiveHide, addOwnLocation
  };
}

/************* Event Handling functions *****/
//this function currently has placeholder functionality
function loanHandler(identifier){
  bookId = parseInt(identifier);
  console.log("called loan handler asking to borrow book#"+identifier);
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

/**Populate the bookshelf with the users books**/
async function populateShelf()
{
  // Empty all the components that require the users books
  $('#bookshelf tbody').empty();
  $('#lendBookDropdown').empty();
  $('#returnBookDropdown').empty();

  // If a user's cookie exists, extract their user_id
  if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_id=')).length) {

      let currentUser = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");

      const allBooks = await apiGetBookTable();

      // For every book, check if it is owned by the current user
      for(var key in allBooks) {

        var owner = allBooks[key].owner_id;

        // If it is the current users book
        if(owner === currentUser){

          // Check if the book is borrowed
          let status = allBooks[key].borrowed_by;
          if(status === "null"){
            status = "None";
          }

          // Populate the current users bookshelf
          $('#bookshelf > tbody').append($('<tr>').html(
            "<td>" + allBooks[key].title + "</td>" +
            "<td>" + allBooks[key].author + "</td>" +
            "<td>" + allBooks[key].isbn + "</td>" +
            "<td>" + status + "</td>" +
            "<td>" + '<button type="button" class="btn btn-secondary" id="removeBookButton" onclick="removeBook(' +allBooks[key].book_id+ ')">Remove</button>' + "</td>"
            ));

          // Also populate books that can be returned and lent in Requests
          if(allBooks[key].borrowed_by === "null" ){
            $('#lendBookDropdown').append('<option value=' + allBooks[key].book_id + '>' + allBooks[key].title + '</option>');
          }
          if(allBooks[key].borrowed_by !== "null" ){
            $('#returnBookDropdown').append('<option value=' + allBooks[key].book_id + '>' + allBooks[key].title + '</option>');
          }
        }
      }
  }

  // Check to make sure the user has books to lend
  if($("#lendBookDropdown option").length == 0){
      $('#lendButton').addClass('disabled');
  }else{
      $('#lendButton').removeClass('disabled');
  }

  // Check to make sure the user has books to be returned
  if($("#returnBookDropdown option").length == 0){
      $('#returnButton').addClass('disabled');
  }else{
      $('#returnButton').removeClass('disabled');
  }
}

/**Remove a book from the users bookshelf**/
async function removeBook(removeKey){

  console.log("removed " + removeKey);
  let record_to_delete = {
      "tablename" : "book_table",
      "column_name" : "book_id",
      "value" : removeKey,
  };
  await apiDeleteRecord(record_to_delete);

  //make the new page up to date
  populateShelf();
}

/**Add a book from the users bookshelf**/
async function addBook(){
  // If a user's cookie exists, extract their user_id
  if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_id=')).length) {

      let owner = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
      let titleInput = $("#inputTitle").val();
      let authorInput = $("#inputAuthor").val();
      let isbnInput = $("#inputISBN").val();
      let genreInput = $("#inputGenre").val();

      if (titleInput === "" || authorInput === "" || isbnInput === "" || genreInput === "Select Genre..."){
        alert("All fields must be entered to add a book");
        return;
      }
      const allBooks = await apiGetBookTable();
      // Getting the next Id for the book, since the DB is kind of weird it has to be done this way
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

      //make the new page up to date
      populateShelf();

      $('#errorMessage').text("The book " + titleInput + " was added successfully!");
      $('#alertDialog').modal('show');
    }
}

/************* Chat Functions **************/

/**Lend a book from the users bookshelf to the current chatrooms other user**/
async function lendABook(){
  // If there are books that can be lent
  if($("#lendBookDropdown option").length > 0){

    // Get the information from the UI
    let bookToLendTitle = $("#lendBookDropdown option:selected" ).text();
    let bookToLend = $("#lendBookDropdown option:selected" ).val();
    let personWhoBorrows = $("#lendButton").val();

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
  // If there are books that can be returned
  if($("#returnBookDropdown option").length > 0){

    // Get the information from the UI
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
  markers.deleteMarkers();
  let userId = -1;
  if (document.cookie.split(';').filter((item) => item.trim().startsWith('user_id')).length) {
    userId = document.cookie.replace(/(?:(?:^|.*;\s*)user_id\s*\=\s*([^;]*).*$)|^.*$/, "$1");
  }
  const users = await apiGetUserTable();

  for(let userToAdd of users){
    // un-comment to see the record structure
    //console.log(userToAdd);
    //do not add the currently active user to the map
    if(userToAdd.user_id === parseInt(userId)){
      markers.addOwnLocation(userToAdd);
    }
    else{
      markers.addUserMarker(userToAdd);
    }
  }

  const books = await apiGetBookTable();
  for(let bookToAdd of books){
    if(bookToAdd.owner_id === userId){
      continue
    }
    markers.addBookToUser(bookToAdd.owner_id, bookToAdd);
  }

  markers.setInfoWindows();
}

async function populateBooksAround()
{
  const allBooks = await apiGetBookTable();
  const allUsers = await apiGetUserTable();

  var curr_lon = parseFloat((((document.cookie.split(';'))[1]).split('='))[1]);
  var curr_lat = parseFloat((((document.cookie.split(';'))[2]).split('='))[1]);

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
  //clear table
  $('#tb').empty();
  // console.log(query);
  markers.selectiveHide(query);
}

// this function will be executed on click of X (clear button) - only for chrome/safari
$('input[type=search]').on('search', function () {
  populateMap();
  populateBooksAround();
});
// universal clear button (works on all browsers)
function fieldReset(){
    var fieldval = document.getElementById("searchInput");
    //clear the table
    $('#tb').empty();

    if(fieldval){
        fieldval.value = '';
    }
    populateMap();
    populateBooksAround();
}

/************* Admin Functions **************/

//**Checks if a user is banned or not**
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

//**Ban/Unbans the User on the left**
async function banUserA()
{
  let idToBan = $(banFirstUser).val();

  // If the user is not banned
  if($('#banFirstUser').text().search("Unban") === -1){

    // Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'banned',
        "where_d" : "user_id",
        "where_v" : parseInt(idToBan),
    };

    await apiUpdateRecord(updateuserrecord);

    // Update the screen
    $('#banFirstUser').text("Unban user_" + idToBan);
  }else{

    // Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'active',
        "where_d" : "user_id",
        "where_v" : idToBan,
    };

    await apiUpdateRecord(updateuserrecord);

    // Update the screen
    $('#banFirstUser').text("Ban user_" + idToBan);
  }
}

//**Ban/Unbans the User on the right**
async function banUserB()
{
  let idToBan = $(banSecondUser).val();

  // If the user is not banned
  if($('#banSecondUser').text().search("Unban") === -1){

    // Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'banned',
        "where_d" : "user_id",
        "where_v" : parseInt(idToBan),
    };

    await apiUpdateRecord(updateuserrecord);

    // Update the screen
    $('#banSecondUser').text("Unban user_" + idToBan);
  }else{
    // Change status in the DB
    let updateuserrecord = { "tablename" : "user_table",
        "cell_d" : "status",
        "cell_v" : 'active',
        "where_d" : "user_id",
        "where_v" : idToBan,
    };

    await apiUpdateRecord(updateuserrecord);

    // Update the screen
    $('#banSecondUser').text("Ban user_" + idToBan);
  }
}

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

/************* Initializations **************/
function initMap(){
  collabooksMap = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.078113, lng: -114.129029},
      zoom: 13
    });
    populateMap();
}

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

  return {addUserMarker, addBookToUser, setInfoWindows, removeMarker, modifyBook, removeBook};
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
      $('.ProfilePage').hide();
      initMap();
    }
    else if ($(this).text() === "Bookshelf") {
      $('.HomePage').hide();
      $('.BookshelfPage').show();
      $('.RequestsPage').hide();
      $('.ProfilePage').hide();
    }
    else if ($(this).text() === "Requests") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').show();
      $('.ProfilePage').hide();
    }
    else if ($(this).text() === "My Profile") {
      $('.HomePage').hide();
      $('.BookshelfPage').hide();
      $('.RequestsPage').hide();
      $('.ProfilePage').show();
    }

} );

/************* Bookshelf Functions **************/

async function populateShelf()
{
  // TODO: Use cookies to keep track of current user?
  const currentUser = "18";

  const allBooks = await apiGetBookTable();

  // TODO: this is pretty ugly, can we make it nicer or you just HAVE to get all the books?
  for(var key in allBooks) {

    var owner = allBooks[key].owner_id;

    if(owner === currentUser){

      let status = allBooks[key].borrowed_by;

      if(status === "null"){
        status = "None";
      }

      $('#bookshelf > tbody').append($('<tr>').html(
        "<td>" + allBooks[key].title + "</td>" +
        "<td>" + allBooks[key].author + "</td>" +
        "<td>" + allBooks[key].isbn + "</td>" +
        "<td>" + status + "</td>" +
        "<td>" + '<button type="button" class="btn btn-secondary" id="removeBookButton" onclick="removeBook(' +allBooks[key].book_id+ ')">Remove</button>' + "</td>"
        ));
    }
  }
}

/************* Main Page Functions **************/

async function populateMap()
{
  const users = await apiGetUserTable();

  for(let userToAdd of users){
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

//only show 10 books
  for(let key = 0; key < 10; key++){

  // Beware if you use the below for statement
  // for(var key in allBooks) {
    if(allBooks[key].borrowed_by === "null"){
      $('#booksidebar > tbody').append($('<tr>').html(
        "<td>" + allBooks[key].title + "</td>" +
        "<td>" + allBooks[key].author + "</td>"
        ));
    }
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

  $('#bookshelf tbody').empty();

  //make the new page up to date
  await populateShelf();
}

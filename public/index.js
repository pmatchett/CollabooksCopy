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
    infoString = "<h4>User:</h4><b>User Id: </b>" + markers[userId].id + "<h4>User's books:</h4>";
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

  //not fully tested yet
  function removeMarker(id){
    markers[id].marker.setMap(null);
    markers[id].marker = null;
    markers[id] = undefined;
  }
  //not fully tested
  function modifyBook(userId, newBookInfo){
    for(let bookToChange of markers[userId].books){
      if(bookToChange.book_id === newBookInfo.book_id){
        Object.assign(bookToChange, newBookInfo);
        break;
      }
    }
    updateInfoWindow(userId);
  }
  //not fully tested
  function removeBook(ownerId, bookId){
    for(let bookIndex in markers[userId].books){
      if(markers[userId].books[bookIndex].book_id === bookId){
        markers[userId].books[bookIndex].splice(bookIndex,1);
        break;
      }
    }
    updateInfoWindow(userId);
  }

  return {addUserMarker, addBookToUser, setInfoWindows, removeMarker, modifyBook, removeBook};
}

/************* Event Handling functions *****/
//this function currently has placeholder functionality
function loanHandler(identifier){
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

/************* Placeholder Functions **************/

// TODO: connect to database
async function populateShelf()
{

  let books = [{title: "Twilight",author: "Meyer, Stephenie",ISBN: 7387258726782,status: "in"},
              {title: "New Moon",author: "Meyer, Stephenie",ISBN: 7453545326782,status: "in"},
              {title: "Eclipse",author: "Meyer, Stephenie",ISBN: 7387547656782,status: "out"},
              {title: "Breaking Dawn",author: "Meyer, Stephenie",ISBN: 738657877782,status: "in"}];

  books.forEach((item, i) => {
    $('#bookshelf > tbody').append($('<tr>').html(
      "<td>" + item.title + "</td>" +
      "<td>" + item.author + "</td>" +
      "<td>" + item.ISBN + "</td>" +
      "<td>" + item.status + "</td>" +
      '<td><button type="button" class="btn btn-secondary" name="removeBook" onclick="removeBook(' + item.ISBN + ')">Remove</button></td>'
      ));
  });
}

// TODO: connect to database
async function populateBooksAround()
{
  const users = await apiGetUserTable();
  //console.log(typeof users);
  //console.log(users);
  for(let userToAdd of users){
    markers.addUserMarker(userToAdd);
  }

  const books = await apiGetBookTable();
  for(let bookToAdd of books){
    markers.addBookToUser(bookToAdd.owner_id, bookToAdd);
  }

  markers.setInfoWindows();

  /*let books = [{title: "Twilight",author: "Meyer, Stephenie",ISBN: 7387258726782,status: "in", latitude:51.078113, longitude:-114.129029},
              {title: "New Moon",author: "Meyer, Stephenie",ISBN: 7453545326782,status: "in", latitude:51.079, longitude:-114.129029},
              {title: "Eclipse",author: "Meyer, Stephenie",ISBN: 7387547656782,status: "out", latitude:51.077, longitude:-114.13},
              {title: "Breaking Dawn",author: "Meyer, Stephenie",ISBN: 738657877782,status: "in", latitude:51.08, longitude:-114.126}];

  books.forEach((item, i) => {
    $('#booksidebar > tbody').append($('<tr>').html(
      "<td>" + item.title + "</td>" +
      "<td>" + item.author + "</td>" +
      "<td>" + item.status + "</td>"
      ));
    markers.addMarker(item);
  });*/

}

// TODO: connect to database
function removeBook(removeISBN){
  console.log("Removed " + removeISBN);
}

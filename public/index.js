/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 07/04/2020
********************************************/

/*************Global Variables**************/
let map;
let bookIcon = 'https://maps.google.com/mapfiles/kml/shapes/library_maps.png';
//list of markers, needed to keep track of them
let markers = [];
let markerIndex = 0;
let markerId = 0;

/************* Initializations **************/
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.078113, lng: -114.129029},
      zoom: 15
    });
}


/************* Google maps functions ********/
function addMarker(book){
  let markerPosition = {lat:book.latitude, lng:book.longitude};
  let marker = new google.maps.Marker({position:markerPosition, map:map, icon: bookIcon});
  //This string will change once we know more about what information we want to show
  let bookInfo = "<b>Title:</b> " + book.title + "<br><b>Author:</b> " + book.author + "<br><b>Status:</b> " + book.status;
  //Only adding the button to rent a book if it is currently available
  if(book.status === "in"){
    //when the button is pressed it will call the function loanHandler with the book identifiers as an argument
    bookInfo = bookInfo + "<br><button type='button' onclick='loanHandler("+book.ISBN+")' class='loanButton'>Ask to loan</button>";
    //'loanHandler("+book+")'
  }
  let infoWindow = new google.maps.InfoWindow({content: bookInfo});
  marker.addListener("click", function(){
    infoWindow.open(map, marker);
  });
  markers[markerIndex] = {id:markerId, marker:marker};
  markerId++;
  markerIndex++;
}


function removeMarker(id){
  for(let tempIndex in markers){
    if(markers[tempIndex].id === id){
      markers[tempIndex].marker.setMap(null);
      markers[tempIndex].marker = null
      markers.splice(tempIndex, 1);
      markerIndex--;
      return;
    }
  }
}

function modifyMarker(){

}

/************* Event Handling functions *****/
//this function currently has placeholder functionality
function loanHandler(identifier){
  console.log("called loan handler");
  console.log(identifier);
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
function populateShelf()
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
function populateBooksAround()
{
  let books = [{title: "Twilight",author: "Meyer, Stephenie",ISBN: 7387258726782,status: "in", latitude:51.078113, longitude:-114.129029},
              {title: "New Moon",author: "Meyer, Stephenie",ISBN: 7453545326782,status: "in", latitude:51.079, longitude:-114.129029},
              {title: "Eclipse",author: "Meyer, Stephenie",ISBN: 7387547656782,status: "out", latitude:51.077, longitude:-114.13},
              {title: "Breaking Dawn",author: "Meyer, Stephenie",ISBN: 738657877782,status: "in", latitude:51.08, longitude:-114.126}];

  books.forEach((item, i) => {
    $('#booksidebar > tbody').append($('<tr>').html(
      "<td>" + item.title +"&emsp;||&emsp;"+ item.author +"&emsp;||&emsp;"+ item.status + "</td>"
      ));
    addMarker(item);
  });

}

// TODO: connect to database
function removeBook(removeISBN){
  console.log("Removed " + removeISBN);
}

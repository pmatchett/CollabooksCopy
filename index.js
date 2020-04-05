/********** SENG513 Final Project **********
*  Members: Jasmine Cronin
*           Brandt Davis
*           Patrick Matchett
*           Ashley Millette
*           Siobhan O’Dell
*           Kent Wong
*  Created On: 11/03/2020
*  Last revision: 04/04/2020
********************************************/

/*************Global Variables**************/
let map;

/************* Initializations **************/
function initMap(){
  map = new google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.078113, lng: -114.129029},
      zoom: 15
    });
  let markerPosition = {lat: 51.078113, lng: -114.129029};
  let marker = new google.maps.Marker({position: markerPosition, map: map});
  }

$(document).ready(function(){
  $("#testButton").click(function(){
    let pos = {lat: 51.079, lng: -114.129029};
    let marker2 = new google.maps.Marker({position: pos, map: map});
    let bookInfo = "This is a <b>very good book</b>";
    let infoWindow = new google.maps.InfoWindow({content: bookInfo});
    marker2.addListener("click",function(){
      infoWindow.open(map, marker2);
    });
  });
});

/************* Page Navigation **************/

/*****Changes the selected tab on the navbar*****/
$(document).on('click','.nav li', function (e) {
    $(this).addClass('active').siblings().removeClass('active');

    if ($(this).text() === "Home") {

      // TODO: figure out why map isn't working
      $("#mainContent").html(`
        <div id="map"></div>
        <button id="testButton" class="btn btn-secondary" type="button">Add a marker</button>
        `);
      $("#sidebarContent").html(`
        <table class="table table-hover text-left" id="booksidebar">
          <thead>
            <tr>
              <th>Books Around</th>
            </tr>
          </thead>
          <tbody>
          <!-- /******** Books Added Here ********/ -->
          </tbody>
        </table>
        <!-- DEBUG:  -->
        <button type="button" class="btn btn-secondary" name="populate" onclick="populateBooksAround()">Populate</button>
        `);
    }
    else if ($(this).text() === "Bookshelf") {
      $("#mainContent").html(`

        <!---------- Bookshelf Content ----------->
        <h1> My Bookshelf </h1>
        <table class="table table-hover" id="bookshelf">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>ISBN</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
          <!-- /******** Books Added Here ********/ -->
          </tbody>
        </table>
        <!-- DEBUG:  -->
        <button type="button" class="btn btn-secondary" name="populate" onclick="populateShelf()">Populate</button>
        `);

      $("#sidebarContent").html(`
        <!---------- Bookshelf Content ----------->
        <h1> Add A Book </h1>
        <form>
          <div class="form-group row">
            <label for="inputTitle" class="col-sm-3 col-form-label">Title</label>
            <div class="col-sm-9">
              <input id="inputTitle" type="text" class="form-control">
            </div>
          </div>

          <div class="form-group row">
            <label for="inputAuthor" class="col-sm-3 col-form-label">Author</label>
            <div class="col-sm-9">
              <input id="inputAuthor" type="text" class="form-control">
              <small id="authorHelpBlock" class="form-text text-muted">
                Last name, First name
              </small>
            </div>
          </div>

          <div class="form-group row">
            <label for="inputGenre" class="col-sm-3 col-form-label">Genre</label>
            <div class="col-sm-9">
            <select id="inputGenre" class="form-control form-control-sm">
              <option>Select Genre...</option>
              <option>Fiction</option>
              <option>Non-Fiction</option>
            </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="inputDuration" class="col-sm-3 col-form-label">Duration</label>
            <div class="col-sm-9">
            <select id="inputDuration" class="form-control form-control-sm">
              <option>Select Borrow Duration...</option>
              <option>1 Week</option>
              <option>2 Weeks</option>
              <option>3 Weeks</option>
            </select>
            </div>
          </div>

          <div class="form-group row">
            <label for="inputISBN" class="col-sm-3 col-form-label">ISBN</label>
            <div class="col-sm-9">
              <input id="inputISBN" type="number" class="form-control">
            </div>
          </div>

          <button type="submit" class="btn btn-secondary btn-lg">Add</button>
        </form>
        `);
    }
    else if ($(this).text() === "Requests") {
      $("#mainContent").html("Where the chat goes");
      $("#sidebarContent").html("Placeholder for where other chats go");
    }
    else if ($(this).text() === "My Profile") {
      $("#mainContent").html("This is a Profile.");
      $("#sidebarContent").html("This is a Sidebar.");
    }

} );

/************* DEBUG **************/
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
      "<td>" + item.status + "</td>"
      ));
  });
}

function populateBooksAround()
{
  let books = [{title: "Twilight",author: "Meyer, Stephenie",ISBN: 7387258726782,status: "in"},
              {title: "New Moon",author: "Meyer, Stephenie",ISBN: 7453545326782,status: "in"},
              {title: "Eclipse",author: "Meyer, Stephenie",ISBN: 7387547656782,status: "out"},
              {title: "Breaking Dawn",author: "Meyer, Stephenie",ISBN: 738657877782,status: "in"}];

  books.forEach((item, i) => {
    $('#booksidebar > tbody').append($('<tr>').html(
      "<td>" + item.title +"&emsp;||&emsp;"+ item.author +"&emsp;||&emsp;"+ item.status + "</td>"
      ));
  });

}

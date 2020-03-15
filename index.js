let map;
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


var markers = [];
var infoboxes = [];
var icons =[];
var marker;
var latitude;
var longitude;

var myOptions = { // map settings
        zoom: 8,
        center: new google.maps.LatLng(51.96593143, 6.27978556),
        mapTypeId: google.maps.MapTypeId.ROADMAP,
        sensor: 'true'
    }

var map = new google.maps.Map(document.getElementById("canvas-map"), myOptions);

var image = {
    url: 'https://i.imgur.com/TZ2rAuV.png',
    // This marker is 20 pixels wide by 32 pixels high.
    size: new google.maps.Size(20, 32),
    // The origin for this image is (0, 0).
    origin: new google.maps.Point(0, 0)
  };
  var shape = {
    coords: [1, 1, 1, 20, 18, 20, 18, 1],
    type: 'poly'
  };

document.getElementById('submit').addEventListener("click", function(event) {
	$.ajax({
		type: "POST",
		url: "http://127.0.0.1:1337/locationTarget",
		data: {"longitude": longitude, "latitude": latitude}
	});
});

google.maps.event.addListener(map, "click", function (event) {
    
    latitude = event.latLng.lat();
    longitude = event.latLng.lng();
    document.getElementById("lat").value = latitude;
    document.getElementById("long").value = longitude;
    console.log( latitude + ', ' + longitude );
    if(marker!=null)
    marker.setMap(null);
    marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true,
        icon:'https://i.imgur.com/SKwGwUR.png',
        animation: google.maps.Animation.DROP
    });
    google.maps.event.addListener(marker, "dragend", function(event) {
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    document.getElementById("lat").value = latitude;
    document.getElementById("long").value = longitude;
    console.log( latitude + ', ' + longitude );
});

});
 

jQuery(document).ready(function(){
    initialize();
});


    var markers = [];
    var infoboxes = [];
    var icons =[];
    var marker;
    var robotMarker;
    var ToggleStatus = false;
    var myLatLng = {lat: 52.14538154148927, lng: 5.6524658203125};
    var lat;
    var long;

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
robotMarker=new google.maps.Marker({
        position: myLatLng,
        map: map,
        icon:'https://i.imgur.com/SKwGwUR.png',
        animation: google.maps.Animation.DROP
    });

executeAsync();

google.maps.event.addListener(map, "click", function (event) {
    
    var latitude = event.latLng.lat();
    var longitude = event.latLng.lng();
    lat= latitude;
    long=longitude;
    document.getElementById("lat").value = latitude;
    document.getElementById("long").value = longitude;
    console.log( latitude + ', ' + longitude );
    if(marker!=null)
    marker.setMap(null);
    marker = new google.maps.Marker({
        position: event.latLng,
        map: map,
        draggable: true,
        //icon:'https://i.imgur.com/SKwGwUR.png',
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

function executeAsync() {
    $.get("/api/GetRobotLocation", function (response) {
        setNewLocation(response);
    });
    setTimeout(executeAsync, 200);
}

function setNewLocation(response){
    var obj = JSON.parse(response);
    var latlng = new google.maps.LatLng(obj.lat, obj.long);
    robotMarker.setPosition(latlng);
}

function Toggle() {
    if(!ToggleStatus)
    {
      document.getElementById("overlay").style.display = "block";
    }
    else
    {
       document.getElementById("overlay").style.display = "none";
    }
    ToggleStatus = !ToggleStatus;
   
}
function post(path, params, method) {
    path = path || "/api/postRoute?LAT="+lat+"&LONG="+long;
$.post(
  path,
  { key1: "value1", key2: "value2" },
  function(data) {
    
  }
);
    //method = method || "post"; // Set method to post by default if not specified.
    //params = params || "{LAT:"+lat+",LONG:"+long+"}";
    // The rest of this code assumes you are not using a library.
    // It can be made less wordy if you use one.
    //var form = document.createElement("form");
    //form.setAttribute("method", method);
    //form.setAttribute("action", path);

    /*for(var key in params) {
        if(params.hasOwnProperty(key)) {
            var hiddenField = document.createElement("input");
            hiddenField.setAttribute("type", "hidden");
            hiddenField.setAttribute("name", key);
            hiddenField.setAttribute("value", params[key]);

            form.appendChild(hiddenField);
        }
    }

    document.body.appendChild(form);
    form.submit();*/
}

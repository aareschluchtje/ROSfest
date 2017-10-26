//voor website kant
function executeAsync(func) {
    setTimeout(func, 2000);
}

executeAsync(function() {
    $.ajax({
    dataType: "json",
    url: "api/GetRobotLocation",
    success: setNewLocation(setNewLocation)
});
});

function setNewLocation(response){
    var obj = JSON.parse(response);
    var latlng = new google.maps.LatLng(obj.lat, obj.long);
    robotMarker.setPosition(latlng);
}

//for the server side
server.post('/api/GetRobotLocation', upload.array(), function(req, res) {
    if(newRobotLocation)
    {
        var ResponseToSend = "{"lat":"+robotLat+",\"long\":"+robotLong+"}";
        res.send(ResponseToSend);
        newRobotLocation = false;
    }
});

//loop voor server om robot locatie op te veragen


function getRobotLocation() {
      const rosnodejs = require('rosnodejs');
    // Requires the std_msgs message package
    const std_msgs = rosnodejs.require('std_msgs').msg;
    // Register node with ROS master
    rosnodejs.initNode('/getrobotlocation_node')
    .then((rosNode) => {
      // Create ROS publisher on the 'chatter' topic with String message
            let sub = rosNode.subscribe('/chatter', std_msgs.String,
        (data) => { // define callback execution
          rosnodejs.log.info('I heard: [' + data.data + ']');
          newRobotLocation = true;
        }
      );
    });
    });
}
#!/usr/bin/env node

'use strict';

var express = require('express');
var server = express();
var path = require('path');
var multer = require('multer');
var upload = multer();
var newMessage = false;

// Require rosnodejs itself
const rosnodejs = require('rosnodejs');
// Requires the std_msgs message package
const std_msgs = rosnodejs.require('std_msgs').msg;

var latitude;
var longitude;
var robotLat;
var robotLong;
var newRobotLocation;

server.use(express.static(path.join(__dirname + '/')));

server.get('/', function(req, res) {
	res.writeHead(200);
	res.sendFile('index.html');
});

server.post('/api/postRoute', upload.array(), function(req, res) {
latitude = getParameterByName("LAT",req.url);
longitude = getParameterByName("LONG",req.url);
	newMessage = true;
	res.end();
});

//for the server side
server.get('/api/GetRobotLocation', function(req, res) {
    if(newRobotLocation)
    {
        var ResponseToSend = "{\"lat\":"+robotLat+",\"long\":"+robotLong+"}";
        res.send(ResponseToSend);
        newRobotLocation = false;
    }
});

//loop voor server om robot locatie op te veragen

//getRobotLocation();

talker();

server.listen(1337, '127.0.0.1');

function talker() {


    // Register node with ROS master
    rosnodejs.initNode('/site_node')
    .then((rosNode) => {
	  // Create ROS publisher on the 'chatter' topic with String message
      let sub = rosNode.subscribe('/Rosaria/gps', std_msgs.String,
      (data) => { // define callback execution
		  var message = data.data;
      rosnodejs.log.info('I heard: [' + message + ']');
		  var array = data.data.split(',');
		  robotLat = array[0];
		  robotLong = array[1];
      newRobotLocation = true;
      });
      // Create ROS publisher on the 'chatter' topic with String message
      let pub = rosNode.advertise('/destination', std_msgs.String);
      let count = 0;
      const msg = new std_msgs.String();
      // Define a function to execute every 100ms
      setInterval(() => {
	if(newMessage)
	{
		// Construct the message
		msg.data = '' + latitude + ',' + longitude;
		// Publish over ROS
		pub.publish(msg);
		// Log through stdout and /rosout
		rosnodejs.log.info('I said: [' + msg.data + ']');
		newMessage = false;
	}
        ++count;
      }, 100);
    });
}
function getParameterByName(name, url) {
    if (!url) url = window.location.href;
    name = name.replace(/[\[\]]/g, "\\$&");
    var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
        results = regex.exec(url);
    if (!results) return null;
    if (!results[2]) return '';
    return decodeURIComponent(results[2].replace(/\+/g, " "));
}

/*function getRobotLocation() {
    rosnodejs.initNode('/getrobotlocation_node')
    .then((rosNode) => {

    });
}*/

var express = require('express');
var server = express();
var path = require('path');
var multer = require('multer');
var upload = multer();
var newMessage = false;

var latitude;
var longitude;

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

talker();

server.listen(1337, '127.0.0.1');

function talker() {

    // Require rosnodejs itself
    const rosnodejs = require('rosnodejs');
    // Requires the std_msgs message package
    const std_msgs = rosnodejs.require('std_msgs').msg;
    // Register node with ROS master
    rosnodejs.initNode('/talker_node')
    .then((rosNode) => {
      // Create ROS publisher on the 'chatter' topic with String message
      let pub = rosNode.advertise('/chatter', std_msgs.String);
      let count = 0;
      const msg = new std_msgs.String();
      // Define a function to execute every 100ms
      setInterval(() => {
	if(newMessage)
	{
		// Construct the message
		msg.data = 'latitude: ' + latitude + ', longitude: ' + longitude;
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

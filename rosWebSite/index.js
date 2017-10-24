var express = require('express');
var server = express();
var path = require('path');
var multer = require('multer');
var upload = multer();

var latitude;
var longitude;

server.use(express.static(path.join(__dirname + '/')));

server.get('/', function(req, res) {
	res.writeHead(200);
	res.sendFile('index.html');
});

server.post('/locationTarget', upload.array(), function(req, res) {
	console.log(req.body);
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
        // Construct the message
        msg.data = 'latitude: ' + latitude + ', longitude: ' + longitude;
        // Publish over ROS
        pub.publish(msg);
        // Log through stdout and /rosout
        rosnodejs.log.info('I said: [' + msg.data + ']');
        ++count;
      }, 100);
    });
}

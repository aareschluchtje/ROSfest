#include <stdlib.h>
#include <iostream>
#include <ros/ros.h>
#include <std_msgs/String.h>
#include <geometry_msgs/Twist.h>
#include <vector>
#include <string>
#include <math.h>

ros::Publisher DriveHelper, DistanceBroadcast;
ros::Subscriber GPSSubscriber, TargetSubscriber, ButtonSubscriber;

float destination[2], lastLocation[2];
float lastBearing, lastDistance, angle;
bool isJoystickControlled = false;

std::vector<std::string> splitCoordinates(std::string);
void TargetCallback(const std_msgs::String::ConstPtr&);
void GPSCallback(const std_msgs::String::ConstPtr&);
void ButtonCallback(const std_msgs::String::ConstPtr&);
void SendDriveMessage(float, float, float[2]);
float CalculateDistance(float[2]);
float CalculateBearing(float[2]);
float CalculateBearing(float[2], float[2]);
float deg_to_rad(float);
float rad_to_deg(float);


std::vector<std::string> splitCoordinates(std::string coordinates){
	std::vector<std::string> returnVector= {"", ""};
	char i = 0;
	for(int index = 0; index < coordinates.size(); index++){
		if(coordinates[index] == ','){
			i = 1;
		} else {
			returnVector[i].append(&coordinates[index]);
		}
	}
	return returnVector;
}

float deg_to_rad(float angle){
	return (angle * M_PI) / 180;
}

float rad_to_deg(float angle){
	return (angle * 180) / M_PI;
}

void SendDriveMessage(float bearing, float speed, float location[2]){
	// bearing 0: front
	// bearing 90: right
	// bearing 180: back
	// bearing -90: left
	bearing = bearing - CalculateBearing(lastLocation, location);
	float calculatedAngle = bearing / 36;
	geometry_msgs::Twist message;
	message.linear.x = speed;
	message.angular.z = calculatedAngle;
	DriveHelper.publish(message);
}

float CalculateDistance(float location[2]){
	float earthRadius = 6371;
	float dLat = deg_to_rad(destination[0] - location[0]);
	float dLong = deg_to_rad(destination[1] - location[1]);
	float a = sin(dLat/2) * sin(dLat/2) + cos(deg_to_rad(location[0])) * cos(deg_to_rad(destination[0])) * sin(dLong/2) * sin(dLong/2);
	float c = 2 * atan2(sqrt(a), sqrt(1-a));
	return earthRadius * c;
}

float CalculateBearing(float location[2]){
	return CalculateBearing(location, destination);
}

float CalculateBearing(float loc[2], float dest[2]){
	float x = cos(dest[0]) * sin(loc[1] - dest[1]);
	float y = cos(loc[0]) * sin(dest[0]) - sin(loc[0]) * cos(dest[0]) * cos(loc[1] - dest[1]);
	float bearing = atan2(x, y);
	return bearing;
}

void TargetCallback(const std_msgs::String::ConstPtr& target){
	std::vector<std::string> tempTarget = splitCoordinates(target->data.c_str());
	destination[0] = std::stof(tempTarget[0]);
	destination[1] = std::stof(tempTarget[1]);
}

void GPSCallback(const std_msgs::String::ConstPtr& gps){
	if(isJoystickControlled){
		return;
	}
	if(destination[0] == 0.0 || destination[1] == 0.0){
		return;
	}
	
	float location[2];
	std::vector<std::string> tempLocation = splitCoordinates(gps->data.c_str());
	location[0] = std::stof(tempLocation[0]);
	location[1] = std::stof(tempLocation[1]);
	angle = 0; //std::stof(tempLocation[2]);

	float distance = CalculateDistance(location);
	if(distance <= 5){
		return;
	}
	std_msgs::String distanceMessage;
	distanceMessage.data = distance;
	DistanceBroadcast.publish(distanceMessage);

	float bearing = CalculateBearing(location);
	
	SendDriveMessage(bearing, 1.0, location);
	
	lastLocation[0] = location[0];
	lastLocation[1] = location[1];
	lastBearing = bearing;
}

void ButtonCallback(const std_msgs::String::ConstPtr& buttons){
	std::vector<std::string> buttonsPressed = splitCoordinates(buttons->data.c_str());
	if(!isJoystickControlled){
		if(buttonsPressed[0] == "1"){
			isJoystickControlled = true;
		}
	} else {
		if(buttonsPressed[1] == "1"){
			isJoystickControlled = false;
		}
	}
}

int main(int argc, char **argv){
	ros::init(argc, argv, "RosMain");
	ros::NodeHandle nh;
	
	TargetSubscriber = nh.subscribe("destination", 2, TargetCallback);
	GPSSubscriber = nh.subscribe("Rosaria/gps", 10, GPSCallback);
	ButtonSubscriber = nh.subscribe("Buttons", 2, ButtonCallback);
	DriveHelper = nh.advertise<geometry_msgs::Twist>("RosAria/cmd_vel", 100);
	DistanceBroadcast = nh.advertise<std_msgs::String>("RosAria/distance", 1);
		
	ros::spin();
}

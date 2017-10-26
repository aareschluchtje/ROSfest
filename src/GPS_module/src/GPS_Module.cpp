#include <ros/ros.h>
#include <geometry_msgs/Twist.h> 
#include <stdlib.h> 
#include <sstream>
#include <sensor_msgs/NavSatFix.h>
#include "std_msgs/String.h"


std_msgs::String gps; 
bool ready = false;
std::stringstream LL;
int main(int argc, char **argv) {
	
     ros::init(argc, argv, "GPS_Module");
     ros::NodeHandle nh;
     
     void Callback(const sensor_msgs::NavSatFix msg);
     ros::Subscriber sub_message0 = nh.subscribe("fix", 1000, Callback);
     ros::Publisher gps_pub = nh.advertise<std_msgs::String>("Rosaria/gps", 1000);
     srand(time(0));
     ros::Rate rate(10);

  while(ros::ok()){ 
	ros::spinOnce();
	if(ready){
		gps.data = LL.str(););
		gps_pub.publish(gps);
	}
	rate.sleep();
  }
}
void Callback(const sensor_msgs::NavSatFix msg)
  {
     LL << msg.latitude << "," << msg.longitude;
		if(LL.str() == "nan,nan")
		{
			ready = false;
		}
		else{
			ready = true;
		}
     
  }


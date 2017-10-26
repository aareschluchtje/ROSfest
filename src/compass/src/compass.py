#!/usr/bin/env python
import rospy
from std_msgs.msg import String
import smbus
import time

bus = smbus.SMBus(1)
address = 0x18

def bearing255():
	bear = bus.read_i2c_block_data(address, 0xFF)
	return bear

while True:
	bearing = bearing255()
	print bearing
	time.sleep(1)

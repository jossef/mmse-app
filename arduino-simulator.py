#!/usr/bin/env python
import paho.mqtt.client as mqtt
import sys
import random

client = mqtt.Client(client_id=random.choice([ 'sim{0}'.format(i) for i in range(10)]))
client.connect("127.0.0.1", 1883)
client.publish("messages", '{"occupied":'+ random.choice(['true', 'false']) +'}', 0)
client.disconnect()
#!/bin/bash
# Commands to execute in terminal
# on DB host machine to detect
# communities, clusters in graph

ssh USERNAME@DB_HOST_ADDRESS -p PORT
# insert password

/usr/bin/arangosh --javascript.execute
# enter password

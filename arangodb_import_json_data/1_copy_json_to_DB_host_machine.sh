#!/bin/bash
scp -P PORT -r /local/path/to/directory/with/json/data/* user@hostname:/remote/path/in/DB/host/where/to/store/json/data/

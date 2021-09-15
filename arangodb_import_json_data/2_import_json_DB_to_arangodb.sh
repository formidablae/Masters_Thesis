#!/bin/bash
# SSH to DB host machine and run:
for file in /remote/path/in/DB/host/where/to/store/json/data/*; do arangoimport --server.endpoint tcp://127.0.0.1:8529 --server.username DB_USERNAME --server.database DB_NAME --file "$file" --type jsonl --collection COLLECTION_NAME --create-collection false --progress true --threads 4; done

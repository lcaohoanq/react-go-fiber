#!/bin/bash

# Stop specific containers (optional, you can specify your container here)
docker stop $(docker ps -a -q)

# Navigate to the project root if needed (check permission issues)
if [[ ! -d "../server" ]]; then
  echo "Error: Cannot navigate to server directory."
  exit 1
fi

cd ../server || { echo "Error: Could not change to server directory"; exit 1; }

# Bring up the containers (if not already running)
docker compose up -d

# Check if Go main file exists before trying to run
if [[ ! -f "main.go" ]]; then
  echo "Error: main.go not found"
  exit 1
fi

# Run the Go server
go run main.go

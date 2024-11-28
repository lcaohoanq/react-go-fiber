#bin/bash

# Stop specific containers (optional, you can specify your container here)
docker stop $(docker ps -a -q)

docker compose up --build
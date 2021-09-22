######################################### SETTINGS #########################################

CONTAINER_NAME=mern-stack-mongo
MONGO_HOST_PORT=27017
MONGO_ADMIN_USER=admin
MONGO_ADMIN_PASS=adminpass123

######################################### CLEANUP #########################################

docker stop /$CONTAINER_NAME
docker rm /$CONTAINER_NAME

######################################### DOCKER DEPLOY #########################################

docker network create mern-stack-net

docker run \
    -e MONGO_INITDB_ROOT_USERNAME=$MONGO_ADMIN_USER \
    -e MONGO_INITDB_ROOT_PASSWORD=$MONGO_ADMIN_PASS \
    -e MONGO_INITDB_DATABASE=admin \
    -p $MONGO_HOST_PORT:27017 \
    -v $(pwd)/mongo-init:/docker-entrypoint-initdb.d \
    --net mern-stack-net \
    --name $CONTAINER_NAME \
    -d \
    mongo:5.0.2
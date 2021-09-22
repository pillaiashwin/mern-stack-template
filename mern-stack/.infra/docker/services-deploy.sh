######################################### SETTINGS #########################################

HOST=local.mernstack.com
CONTAINER_NAME=mern-stack-services

IMAGE_NAME=mern-services:latest

MONGO_HOST=mern-stack-mongo
MONGO_PORT=27017
MONGO_USER=appuser
MONGO_PASS=appuserpass123

CORS_ORIGINS=http://$HOST:3000,http://$CONTAINER_NAME:3000
REACT_APP_GATEWAY_SERVICE_URL=http://$HOST:8080

GATEWAY_SERVICE_URL=http://$CONTAINER_NAME:8080
USER_SERVICE_URL=http://$CONTAINER_NAME:8081
SURVEY_SERVICE_URL=http://$CONTAINER_NAME:8082

GATEWAY_SERVICE_DB_CONN_STR=mongodb://$MONGO_USER:$MONGO_PASS@$MONGO_HOST:$MONGO_PORT/gateway-service?authSource=admin
USER_SERVICE_DB_CONN_STR=mongodb://$MONGO_USER:$MONGO_PASS@$MONGO_HOST:$MONGO_PORT/user-service?authSource=admin
SURVEY_SERVICE_DB_CONN_STR=mongodb://$MONGO_USER:$MONGO_PASS@$MONGO_HOST:$MONGO_PORT/survey-service?authSource=admin

######################################### CLEANUP #########################################

docker stop /$CONTAINER_NAME
docker rm /$CONTAINER_NAME

######################################### DOCKER DEPLOY #########################################

docker network create mern-stack-net

docker buildx build -f ../../Dockerfile -t $IMAGE_NAME \
    --cache-from type=registry,ref=$IMAGE_NAME --cache-to type=inline \
    ../../

docker run \
    -e DB_HOST=$MONGO_HOST \
    -e DB_USER=$MONGO_USER \
    -e DB_PASS=$MONGO_PASS \
    -e DB_PORT=$MONGO_PORT \
    -e CORS_ORIGINS=$CORS_ORIGINS \
    -e REACT_APP_GATEWAY_SERVICE_URL=$REACT_APP_GATEWAY_SERVICE_URL \
    -e GATEWAY_SERVICE_URL=$GATEWAY_SERVICE_URL \
    -e USER_SERVICE_URL=$USER_SERVICE_URL \
    -e SURVEY_SERVICE_URL=$SURVEY_SERVICE_URL \
    -e GATEWAY_SERVICE_DB_CONN_STR=$GATEWAY_SERVICE_DB_CONN_STR \
    -e USER_SERVICE_DB_CONN_STR=$USER_SERVICE_DB_CONN_STR \
    -e SURVEY_SERVICE_DB_CONN_STR=$SURVEY_SERVICE_DB_CONN_STR \
    -p 8080:8080 \
    -p 8081:8081 \
    -p 8082:8082 \
    -p 3000:3000 \
    --net mern-stack-net \
    --name $CONTAINER_NAME \
    -d \
    $IMAGE_NAME
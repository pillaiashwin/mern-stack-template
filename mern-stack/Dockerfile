FROM node:16-alpine3.11

ARG build
ENV BUILD_NUM = $build

####################################################### PACKAGES #######################################################

RUN apk update \
    && apk add -- ca-certificates coreutils java-cacerts curl nodejs npm yarn bash

####################################################### GATEWAY-SERVICE #######################################################

# Define current source and target
ENV SOURCE_PATH=./gateway-service
ENV TARGET_PATH=/gateway-service

# Create app directory
RUN mkdir -p $TARGET_PATH
WORKDIR $TARGET_PATH

# Bundle app source
COPY $SOURCE_PATH/ ./
RUN yarn --network-timeout 30000
RUN yarn build

EXPOSE 8080

####################################################### USER-SERVICE #######################################################

# Define current source and target
ENV SOURCE_PATH=./user-service
ENV TARGET_PATH=/user-service

# Create app directory
RUN mkdir -p $TARGET_PATH
WORKDIR $TARGET_PATH

# Bundle app source
COPY $SOURCE_PATH/ ./
RUN yarn --network-timeout 30000
RUN yarn build

EXPOSE 8081

####################################################### SURVEY-SERVICE #######################################################

# Define current source and target
ENV SOURCE_PATH=./survey-service
ENV TARGET_PATH=/survey-service

# Create app directory
RUN mkdir -p $TARGET_PATH
WORKDIR $TARGET_PATH

# Bundle app source
COPY $SOURCE_PATH/ ./
RUN yarn --network-timeout 30000
RUN yarn build

EXPOSE 8082

####################################################### REACT APP #######################################################

# Define current source and target
ENV SOURCE_PATH=./react-app
ENV TARGET_PATH=/react-app

# Create app directory
RUN mkdir -p $TARGET_PATH
WORKDIR $TARGET_PATH

# Bundle app source
COPY $SOURCE_PATH ./
RUN yarn --network-timeout 30000
RUN yarn build

###########################################################
# If you are building your code for production
# RUN npm ci --only=production

EXPOSE 3000

HEALTHCHECK CMD curl --fail http://localhost:3000/health || exit 1

####################################################### START ALL SERVICES #######################################################

WORKDIR /

RUN yarn global add pm2

CMD pm2 start ./gateway-service/dist/index.js --name gateway-service \
    && pm2 start ./survey-service/dist/index.js --name survey-service \
    && pm2 start ./user-service/dist/index.js --name user-service \
    && cd ./react-app \
    && pm2 start yarn --interpreter bash --name react-app -- start \
    && cd .. \
    && pm2 logs \
    && pm2 stop gateway-service \
    && pm2 stop survey-service \
    && pm2 stop user-service \
    && pm2 stop react-app
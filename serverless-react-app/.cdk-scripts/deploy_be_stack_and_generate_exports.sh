#!/bin/bash
cd ./surveys-backend-cdk/functions
echo "Building lambda functions..."
npm run build
cd ..
echo "Building cdk project..."
npm run build
echo "Deploying resources to AWS..."
cdk deploy -O ../src/cdk-exports.json
cd ..
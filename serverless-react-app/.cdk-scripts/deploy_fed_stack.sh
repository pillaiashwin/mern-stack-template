#!/bin/bash
cd ./surveys-frontend-cdk
echo "Building cdk project..."
npm run build
echo "Deploying resources to AWS..."
cdk deploy
cd ..
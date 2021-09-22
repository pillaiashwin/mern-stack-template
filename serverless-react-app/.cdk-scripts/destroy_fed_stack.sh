#!/bin/bash
cd ./surveys-frontend-cdk
echo "Destroying AWS resources..."
cdk destroy
cd ..
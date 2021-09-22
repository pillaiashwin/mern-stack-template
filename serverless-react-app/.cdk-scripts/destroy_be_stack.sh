#!/bin/bash
cd ./surveys-backend-cdk
echo "Destroying AWS resources..."
cdk destroy
cd ..
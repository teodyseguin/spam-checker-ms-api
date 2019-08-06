#!/bin/sh
# Deployment Script for Spam Checker Microservice API

echo 'deploy starts ...'
echo 'running docker-compose up --build -d'
cd ../
docker-compose up --build -d
docker ps -a

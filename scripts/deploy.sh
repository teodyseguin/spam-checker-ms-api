#!/bin/sh
# Deployment Script for TCP API

echo 'deploy starts ...'
echo 'running docker-compose up --build -d'
cd ../
docker-compose up --build -d
docker ps -a

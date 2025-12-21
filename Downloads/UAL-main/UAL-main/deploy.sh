#!/bin/bash

# UAL Platform - Docker Build and Push Script
# This script builds and pushes the Docker image to Docker Hub

set -e  # Exit on any error

# Configuration
DOCKER_USERNAME="apatilgtn"
IMAGE_NAME="ual"
VERSION="v1.0.0"

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}========================================${NC}"
echo -e "${BLUE}UAL Platform - Docker Deploy${NC}"
echo -e "${BLUE}========================================${NC}"
echo ""

# Step 1: Check if Docker is running
echo -e "${BLUE}[1/6] Checking Docker...${NC}"
if ! docker info > /dev/null 2>&1; then
    echo -e "${RED}Error: Docker is not running. Please start Docker Desktop.${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Docker is running${NC}"
echo ""

# Step 2: Login to Docker Hub
echo -e "${BLUE}[2/6] Logging in to Docker Hub...${NC}"
echo "Please enter your Docker Hub credentials:"
docker login
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker login failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Successfully logged in${NC}"
echo ""

# Step 3: Build the Docker image
echo -e "${BLUE}[3/6] Building Docker image...${NC}"
docker build -t ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} .
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker build failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Image built successfully${NC}"
echo ""

# Step 4: Tag as latest
echo -e "${BLUE}[4/6] Tagging as latest...${NC}"
docker tag ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION} ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
echo -e "${GREEN}✓ Tagged as latest${NC}"
echo ""

# Step 5: Push versioned image
echo -e "${BLUE}[5/6] Pushing version ${VERSION} to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker push failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Pushed ${VERSION}${NC}"
echo ""

# Step 6: Push latest tag
echo -e "${BLUE}[6/6] Pushing latest tag to Docker Hub...${NC}"
docker push ${DOCKER_USERNAME}/${IMAGE_NAME}:latest
if [ $? -ne 0 ]; then
    echo -e "${RED}Error: Docker push failed${NC}"
    exit 1
fi
echo -e "${GREEN}✓ Pushed latest${NC}"
echo ""

echo -e "${GREEN}========================================${NC}"
echo -e "${GREEN}✓ Deployment Complete!${NC}"
echo -e "${GREEN}========================================${NC}"
echo ""
echo "Your image is now available at:"
echo -e "${BLUE}docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:${VERSION}${NC}"
echo -e "${BLUE}docker pull ${DOCKER_USERNAME}/${IMAGE_NAME}:latest${NC}"
echo ""
echo "View on Docker Hub:"
echo -e "${BLUE}https://hub.docker.com/r/${DOCKER_USERNAME}/${IMAGE_NAME}${NC}"

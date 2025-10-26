#!/bin/bash

# Deployment script for Google Cloud Run

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${BLUE}🚀 Deploying Johari Window to Cloud Run${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    echo "Install gcloud CLI: https://cloud.google.com/sdk/docs/install"
    exit 1
fi

# Request Project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Error: Project ID cannot be empty${NC}"
    exit 1
fi

# Request region
echo "Available regions: europe-west1, us-central1, asia-northeast1"
read -p "Enter region (default: europe-west1): " REGION
REGION=${REGION:-europe-west1}

# Configure project
echo -e "\n${BLUE}📝 Configuring project...${NC}"
gcloud config set project $PROJECT_ID

# Build image
echo -e "\n${BLUE}🔨 Building Docker image...${NC}"
gcloud builds submit --tag gcr.io/$PROJECT_ID/johari-window

# Deploy to Cloud Run
echo -e "\n${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy johari-window \
  --image gcr.io/$PROJECT_ID/johari-window \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080

# Get URL
URL=$(gcloud run services describe johari-window --platform managed --region $REGION --format 'value(status.url)')

echo -e "\n${GREEN}✅ Deploy successful!${NC}"
echo -e "${GREEN}🌐 Your application is available at:${NC}"
echo -e "${BLUE}$URL${NC}\n"

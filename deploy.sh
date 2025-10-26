#!/bin/bash

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m'

echo -e "${BLUE}🚀 Deploying Johari Window to Cloud Run${NC}\n"

# Check if gcloud is installed
if ! command -v gcloud &> /dev/null; then
    echo -e "${RED}❌ Error: gcloud CLI is not installed${NC}"
    exit 1
fi

# Get or request Project ID
PROJECT_ID=$(gcloud config get-value project 2>/dev/null)
if [ -z "$PROJECT_ID" ]; then
    read -p "Enter your Google Cloud Project ID: " PROJECT_ID
    if [ -z "$PROJECT_ID" ]; then
        echo -e "${RED}❌ Error: Project ID cannot be empty${NC}"
        exit 1
    fi
fi

echo -e "${BLUE}📝 Using project: ${PROJECT_ID}${NC}"

# Get or request region
echo "Available regions: europe-west1, us-central1, asia-northeast1"
read -p "Enter region (default: europe-west1): " REGION
REGION=${REGION:-europe-west1}

echo -e "${BLUE}🌍 Using region: ${REGION}${NC}"

echo -e "\n${BLUE}📝 Configuring project...${NC}"
gcloud config set project $PROJECT_ID

# Enable necessary APIs
echo -e "${BLUE}🔧 Enabling required APIs...${NC}"
gcloud services enable run.googleapis.com
gcloud services enable cloudbuild.googleapis.com
gcloud services enable firestore.googleapis.com
gcloud services enable artifactregistry.googleapis.com

# Setup Firestore permissions for Cloud Run
echo -e "${BLUE}🔐 Configuring Firestore permissions...${NC}"
PROJECT_NUM=$(gcloud projects describe $PROJECT_ID --format='value(projectNumber)')
gcloud projects add-iam-policy-binding $PROJECT_ID \
    --member="serviceAccount:${PROJECT_NUM}-compute@developer.gserviceaccount.com" \
    --role="roles/datastore.user" \
    --condition=None 2>/dev/null || echo "Permissions already configured"

# Setup Artifact Registry
echo -e "\n${BLUE}📦 Configuring Artifact Registry...${NC}"
gcloud artifacts repositories create johari-window-repo \
    --repository-format=docker \
    --location=$REGION \
    --description="Docker repository for Johari Window app" 2>/dev/null || echo "Repository already exists"

IMAGE_URL="$REGION-docker.pkg.dev/$PROJECT_ID/johari-window-repo/johari-window:latest"

echo -e "\n${BLUE}🔨 Building app with Cloud Build...${NC}"
gcloud builds submit \
    --tag $IMAGE_URL \
    --region=$REGION

echo -e "\n${BLUE}🚀 Deploying to Cloud Run...${NC}"
gcloud run deploy johari-window \
  --image $IMAGE_URL \
  --platform managed \
  --region $REGION \
  --allow-unauthenticated \
  --port 8080 \
  --memory 512Mi \
  --timeout 60 \
  --set-env-vars="GOOGLE_CLOUD_PROJECT=$PROJECT_ID"

FRONTEND_URL=$(gcloud run services describe johari-window --region=$REGION --format='value(status.url)')

echo -e "\n${GREEN}✅ Deploy complete!${NC}"
echo -e "${GREEN}🌐 Your application is at:${NC}"
echo -e "${BLUE}$FRONTEND_URL${NC}"

echo -e "\n${GREEN}📝 Notes:${NC}"
echo -e "  - Firestore is enabled and configured"
echo -e "  - Backend API is running on /api/*"
echo -e "  - The app supports multiple users across different browsers/devices"
echo ""

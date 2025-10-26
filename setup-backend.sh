#!/bin/bash

# Setup script for Firebase and Firestore

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
RED='\033[0;31m'
NC='\033[0m'

echo -e "${BLUE}🔧 Setting up Firebase for Johari Window${NC}\n"

# Check if Firebase CLI is installed
if ! command -v firebase &> /dev/null; then
    echo -e "${RED}❌ Firebase CLI not installed${NC}"
    echo "Install with: npm install -g firebase-tools"
    exit 1
fi

# Request Project ID
read -p "Enter your Google Cloud Project ID: " PROJECT_ID

if [ -z "$PROJECT_ID" ]; then
    echo -e "${RED}❌ Project ID cannot be empty${NC}"
    exit 1
fi

echo -e "\n${BLUE}📦 Steps to complete:${NC}"
echo "1. Go to: https://console.firebase.google.com/"
echo "2. Click 'Add project' or select existing project"
echo "3. Enable Firestore Database (Native mode)"
echo "4. Copy your Firebase config"
echo "5. Paste it in server/firebase-config.json"
echo ""
echo "Press Enter when Firestore is enabled..."

read

# Initialize Firebase
echo -e "\n${BLUE}🔧 Initializing Firebase...${NC}"
firebase init --project=$PROJECT_ID || echo "Firebase already initialized"

# Setup Firestore rules
echo -e "\n${BLUE}📝 Setting up Firestore...${NC}"
echo "Creating firestore.rules and firestore.indexes.json..."

cat > firestore.rules << 'EOF'
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /sessions/{sessionId} {
      allow read, write: if true;
    }
  }
}
EOF

cat > firestore.indexes.json << 'EOF'
{
  "indexes": [],
  "fieldOverrides": []
}
EOF

# Deploy Firestore rules
echo -e "\n${BLUE}🚀 Deploying Firestore rules...${NC}"
firebase deploy --only firestore:rules --project=$PROJECT_ID

echo -e "\n${GREEN}✅ Firebase setup complete!${NC}"
echo -e "\n${BLUE}Next:${NC}"
echo "1. Get your Firebase config from console.firebase.google.com"
echo "2. Add it to server/firebase-config.json"
echo "3. Run ./deploy.sh to deploy to Cloud Run"


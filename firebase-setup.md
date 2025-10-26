# Setup Firebase + Cloud Run

## Prerequisites
1. Google Cloud Project with billing enabled
2. Firebase CLI: `npm install -g firebase-tools`

## Setup Steps

### 1. Create Firestore Database
1. Go to https://console.firebase.google.com/
2. Add project or select existing
3. Enable Firestore Database (Native mode)
4. Choose location (same as Cloud Run region)
5. Start in production mode

### 2. Get Service Account Key
```bash
gcloud iam service-accounts create johari-window-backend
gcloud projects add-iam-policy-binding YOUR_PROJECT_ID \
    --member="serviceAccount:johari-window-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com" \
    --role="roles/datastore.user"

gcloud iam service-accounts keys create server/firebase-admin.json \
    --iam-account=johari-window-backend@YOUR_PROJECT_ID.iam.gserviceaccount.com
```

### 3. Deploy
```bash
./deploy.sh
```

The deploy script will:
- Build and deploy backend to Cloud Run
- Build and deploy frontend to Cloud Run  
- Connect them automatically

### 4. Access Your App
After deployment, you'll get a URL like:
`https://johari-window-xxxxx.run.app`

The app will work with multiple users across different browsers/devices!


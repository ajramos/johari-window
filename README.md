# Johari Window - Team Exercise

Modern web application for performing the Johari Window exercise with distributed teams. Features real-time collaboration using Firestore and full cloud deployment.

## 🎯 Features

- **Real-time collaboration** with Firestore backend
- **Multi-user support** across different browsers and devices
- **Multi-language** with hot-reload (Spanish, French, English)
- **Dual visualization**: classic (4 equal quadrants) and proportional
- **56 adjectives** from the original Johari Window
- **Unique access codes** for participants
- **Administrator panel** with real-time progress tracking
- **Data export** and image download
- **Live progress updates** showing completion status

## 🏗️ Architecture

### Frontend
- HTML5, CSS3, Vanilla JavaScript
- Responsive design
- Real-time updates every 5 seconds

### Backend
- Node.js + Express API
- Firestore (Google Cloud) for data persistence
- Cloud Run deployment with nginx proxy

## 📋 Usage Flow

### 1. Initial Setup (Admin)
- Access the deployed URL or run locally
- Enter participant names (minimum 2)
- Click "Add participant" to add more team members
- Generate unique access codes
- Share codes with the team

### 2. Participants
- Access participant page with their unique code
- Complete self-assessment (select 5-6 adjectives)
- Evaluate all peers (5-6 adjectives each)
- View progress of other participants in real-time
- See live updates as others complete the exercise

### 3. Analysis (Admin)
- Access admin panel with administrator code
- View real-time progress of all participants
- See completion status (completed/pending)
- Visualize all generated windows
- Download individual or all images
- Export data to JSON

## 🚀 Deployment

### Cloud Run (Recommended)

The app is deployed as a single Cloud Run service with nginx serving the frontend and proxying API calls to the Node.js backend.

```bash
# 1. Deploy using the deploy script
./deploy.sh

# It will:
# - Use your default gcloud project
# - Build the container with nginx + backend
# - Deploy to Cloud Run
# - Configure Firestore permissions
```

**Prerequisites:**
- Google Cloud Project with billing enabled
- Firestore enabled in Firebase Console
- gcloud CLI installed

### Local Development

```bash
# Start local server (backend + frontend)
./start-local.sh

# Access at http://localhost:8080
```

## 📁 Project Structure

```
johari-window/
├── index.html              # Initial setup
├── participant.html       # Participant interface
├── admin.html             # Administrator panel
├── css/
│   └── styles.css         # Application styles
├── js/
│   ├── i18n.js           # Translation system
│   ├── data.js           # API client + adjectives
│   ├── johari.js         # Calculation algorithm
│   ├── canvas.js         # Visualization
│   ├── setup.js          # Setup logic
│   ├── participante.js   # Participant logic
│   └── admin.js          # Admin logic
├── server/
│   ├── server.js         # Express API backend
│   ├── package.json      # Node.js dependencies
│   └── Dockerfile        # Backend container
├── Dockerfile             # Frontend + Backend container
├── start.sh               # Container startup script
├── deploy.sh              # Cloud Run deployment script
└── .gitignore            # Git exclusions
```

## 🔧 Technical Details

### Backend API Endpoints

- `GET /api/session` - Get current session
- `POST /api/session` - Create/update session
- `DELETE /api/session` - Delete session
- `GET /api/participant/:code` - Get participant by code
- `PUT /api/participant/:code/self-assessment` - Save self-assessment
- `PUT /api/participant/:code/peer-assessment/:evaluatedCode` - Save peer assessment

### Data Storage

- **Firestore** collection: `sessions`
- **Document ID**: `current`
- **Schema**:
  ```json
  {
    "adminCode": "ABCDEF",
    "participants": [
      {
        "name": "John Doe",
        "code": "XYZ123",
        "selfAssessment": [...],
        "peerAssessments": {...},
        "completed": false
      }
    ],
    "createdAt": "2025-01-01T00:00:00Z"
  }
  ```

## 🎨 Customization

### Change area colors
Edit in `js/canvas.js`:
```javascript
const colors = {
    open: '#059669',    // Green
    blind: '#d97706',   // Orange
    hidden: '#2563eb',  // Blue
    unknown: '#64748b'  // Gray
};
```

### Add new language
Edit in `js/i18n.js`:
```javascript
translations: {
    es: { ... },
    fr: { ... },
    en: { ... },
    de: { ... }  // New language
}
```

### Modify adjectives
Edit in `js/data.js`:
```javascript
adjectives: {
    es: [ ... ],
    fr: [ ... ],
    en: [ ... ]
}
```

## 🌐 Environment Variables

When deploying to Cloud Run:
- `GOOGLE_CLOUD_PROJECT` - Project ID for Firestore

For local development:
- Set `API_BASE_URL` in browser console or edit HTML

## 💡 FAQ

**Can you use fewer than 2 participants?**
No, minimum of 2 participants required.

**Does it work offline?**
Only with the default LocalStorage fallback. For multi-user collaboration, Firestore backend is required.

**Do codes expire?**
No, codes are permanent as long as the session isn't reset.

**Can the exercise be paused?**
Yes, each participant can close the browser and continue later with their code.

**How does real-time work?**
The app polls the Firestore backend every 5 seconds to get the latest data.

**Is my data secure?**
Yes, data is stored in Google Cloud Firestore with authentication. You can review your project's security settings in the Firebase Console.

## 📊 Cost Estimation

**Firestore Free Tier:**
- 50K reads/day
- 20K writes/day
- 20K deletes/day
- 1GB storage

For typical usage (10 participants, once per month):
- Reads: ~500 operations
- Writes: ~300 operations
- Storage: <1MB

**Cloud Run:**
- Free tier: 2 million requests/month
- After that: $0.40 per million requests

## 🔒 Privacy

- Data is stored in Google Cloud Firestore
- Access controlled by unique codes
- No personal information collected
- Data can be exported and deleted at any time

## 🤝 Credits

Based on the **Johari Window** by Joseph Luft and Harry Ingham (1955).

## 📝 License

Free for educational and business use.

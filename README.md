# Johari Window - Team Exercise

Minimalist web application for performing the Johari Window exercise with distributed teams.

## 🎯 Features

- **HTML5 + CSS3 + Vanilla JavaScript** (no dependencies)
- **Multi-language** with hot-reload (Spanish, French, English)
- **Local persistence** with LocalStorage
- **Dual visualization**: classic (4 equal quadrants) and proportional
- **56 adjectives** from the original Johari Window
- **Unique access codes** for participants
- **Administrator panel** with view of all windows
- **Data export** and image download

## 📋 Usage Flow

### 1. Initial Setup (Admin)
- Access `index.html`
- Enter participant names (minimum 2)
- Generate unique access codes
- Share codes with the team

### 2. Participants
- Access `participant.html` with their code
- Complete self-assessment (5-6 adjectives)
- Evaluate all peers (5-6 adjectives each)
- View their window upon completion

### 3. Analysis (Admin)
- Access `admin.html` with administrator code
- View everyone's progress
- Visualize all generated windows
- Download individual or all images
- Export data to JSON

## 🚀 Deployment

### Option 1: Local
```bash
# Simple Python server
python3 -m http.server 8000

# Or with Node.js
npx http-server -p 8000
```

Access `http://localhost:8000`

### Option 2: Cloud Run (Google Cloud)
```bash
# 1. Create a Dockerfile
FROM nginx:alpine
COPY . /usr/share/nginx/html
EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]

# 2. Build and deploy
gcloud builds submit --tag gcr.io/[PROJECT-ID]/johari-window
gcloud run deploy johari-window \
  --image gcr.io/[PROJECT-ID]/johari-window \
  --platform managed \
  --allow-unauthenticated
```

### Option 3: Netlify/Vercel
- Upload the complete folder
- Automatic deploy
- Ready! 🎉

## 📁 Project Structure

```
johari-window/
├── index.html              # Initial setup
├── participant.html       # Participant interface
├── admin.html             # Administrator panel
├── css/
│   └── styles.css         # Minimalist styles
└── js/
    ├── i18n.js           # Translation system
    ├── data.js           # Adjectives + storage
    ├── johari.js         # Calculation algorithm
    ├── canvas.js         # Visualization
    ├── setup.js          # Setup logic
    ├── participante.js   # Participant logic
    └── admin.js          # Admin logic
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

## 🔒 Privacy

- All data is stored in browser's **LocalStorage**
- No backend or external database
- Data remains on user's device
- Can be exported to JSON for backup

## 💡 FAQ

**Can you use fewer than 2 participants?**
No, minimum of 2 participants required.

**Do codes expire?**
No, codes are permanent as long as the session isn't reset.

**Can the exercise be paused?**
Yes, each participant can close the browser and continue later with their code.

**Does it work offline?**
Yes, once loaded initially, it works offline.

## 📝 License

Free for educational and business use.

## 🤝 Credits

Based on the **Johari Window** by Joseph Luft and Harry Ingham (1955).

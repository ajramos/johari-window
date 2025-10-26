# Quick Start Guide - Johari Window

Get the Johari Window application up and running in minutes.

## 🚀 Quick Deployment to Cloud Run

### Prerequisites
```bash
# Install gcloud CLI
# https://cloud.google.com/sdk/docs/install

# Login to your Google account
gcloud auth login

# Set your project (optional - script will ask)
gcloud config set project YOUR_PROJECT_ID
```

### Deploy in 3 Steps

1. **Clone the repository**
   ```bash
   git clone https://github.com/ajramos/johari-window.git
   cd johari-window
   ```

2. **Run the deploy script**
   ```bash
   ./deploy.sh
   ```
   
   The script will:
   - Ask for your project ID (or use default from gcloud)
   - Ask for region (default: europe-west1)
   - Enable necessary APIs
   - Configure Firestore permissions
   - Build and deploy the application
   - Give you the deployment URL

3. **Enable Firestore in Firebase Console**
   - Go to https://console.firebase.google.com
   - Select your project
   - Enable Firestore Database (Native mode)
   - Choose your preferred location

That's it! Your app is live. 🎉

## 📱 Using the Application

### Step 1: Create Session (Admin)

1. Open your deployed URL
2. Enter participant names (minimum 2)
3. Click "+ Add participant" to add more
4. Click "Generate access codes"
5. Share codes with your team

### Step 2: Participants Complete Assessment

1. Each participant opens the participant page
2. Enters their personal code
3. Completes self-assessment (select 5-6 adjectives)
4. Evaluates all peers (5-6 adjectives each)
5. Views their Johari Window

### Step 3: View Results (Admin)

1. Open admin page with admin code
2. See real-time progress of all participants
3. View all completed windows
4. Download individual or all images

## 🧪 Local Development

### Start Locally

```bash
./start-local.sh
```

Access at `http://localhost:8080`

### Note: Local mode uses LocalStorage and doesn't support multi-user collaboration. Use Cloud Run deployment for multi-user testing.

## 📊 Understanding the Johari Window

The application divides 56 adjectives into 4 areas:

1. **Open Area** (Green): What I know and others know
2. **Blind Area** (Orange): What others know but I don't
3. **Hidden Area** (Blue): What I know but others don't
4. **Unknown Area** (Gray): What neither I nor others know

## 🔧 Troubleshooting

### "Code not valid" error

- Make sure you're using the correct code (case-sensitive)
- Verify the session still exists in Firestore
- Try refreshing the page

### Progress not updating

- App auto-refreshes every 5 seconds
- Check browser console for errors
- Verify Firestore is enabled and has proper permissions

### Backend not working

- Check Cloud Run logs: `gcloud run services logs read johari-window --region YOUR_REGION`
- Verify Firestore is enabled in Firebase Console
- Ensure the service has `roles/datastore.user` permission

## 📁 Key Files

- `index.html` - Setup page
- `participant.html` - Participant interface  
- `admin.html` - Admin dashboard
- `js/data.js` - API client and data logic
- `server/server.js` - Backend API
- `deploy.sh` - Deployment script

## 🌍 Production Deployment

### Custom Domain

1. Map a custom domain in Cloud Run
2. Update `API_BASE_URL` if needed
3. Test all functionality

### Monitoring

- Check Cloud Run metrics in GCP Console
- Monitor Firestore usage in Firebase Console
- Set up alerts for high usage

## 📞 Support

For issues or questions:
- Check GitHub Issues: https://github.com/ajramos/johari-window
- Review logs in Cloud Run console
- Test with 2 participants first before scaling

## 🎯 Best Practices

1. **Always start with 2 participants** to test the flow
2. **Save admin code** before distributing participant codes
3. **Use "New Session" button** to start fresh experiments
4. **Export data** before resetting if you want to keep results
5. **Monitor Firestore usage** if expecting many sessions

## ✨ Features

- ✅ Real-time collaboration
- ✅ Multi-language support (ES/FR/EN)
- ✅ Live progress tracking
- ✅ Auto-updating dashboard
- ✅ Beautiful visualizations
- ✅ Export and download options
- ✅ Responsive design
- ✅ No external dependencies (frontend)
- ✅ Cloud-native backend

Enjoy your Johari Window exercise! 🚀

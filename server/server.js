const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Initialize Firebase Admin
let db;

try {
    // Try to use Application Default Credentials (for Cloud Run)
    admin.initializeApp({
        credential: admin.credential.applicationDefault(),
        projectId: process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID
    });
    db = admin.firestore();
    console.log('Firebase Admin initialized with ADC');
} catch (error) {
    console.error('Failed to initialize Firebase:', error.message);
    console.log('Continuing without Firebase - backend will not work properly');
    // Create a mock db object to prevent crashes
    db = {
        collection: () => ({
            doc: () => ({
                get: () => Promise.resolve({ exists: false }),
                set: () => Promise.resolve(),
                delete: () => Promise.resolve()
            })
        })
    };
}

// API Routes

// Get session
app.get('/api/session', async (req, res) => {
    try {
        const sessionRef = db.collection('sessions').doc('current');
        const sessionDoc = await sessionRef.get();
        
        if (sessionDoc.exists) {
            res.json(sessionDoc.data());
        } else {
            res.json(null);
        }
    } catch (error) {
        console.error('Error getting session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Create/update session
app.post('/api/session', async (req, res) => {
    try {
        const session = req.body;
        const sessionRef = db.collection('sessions').doc('current');
        await sessionRef.set(session);
        res.json({ success: true });
    } catch (error) {
        console.error('Error saving session:', error);
        res.status(500).json({ error: error.message });
    }
});

// Delete session
app.delete('/api/session', async (req, res) => {
    try {
        const sessionRef = db.collection('sessions').doc('current');
        await sessionRef.delete();
        res.json({ success: true });
    } catch (error) {
        console.error('Error deleting session:', error);
        res.status(500).json({ error: error.message });
    }
});

const port = process.env.BACKEND_PORT || 3000;
app.listen(port, '127.0.0.1', () => {
    console.log(`Backend API listening on port ${port}`);
});


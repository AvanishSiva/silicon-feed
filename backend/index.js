const express = require('express')
const admin = require('firebase-admin')
const bodyParser = require('body-parser')
const cors = require('cors')
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5002

const firebaseKey = process.env.FIREBASE_KEY
const decodedKey = Buffer.from(firebaseKey, 'base64').toString('utf8');
const serviceAccount = JSON.parse(decodedKey);

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

app.use(cors())
const allowedOrigins = ['https://silicon-feed.onrender.com'];
app.use(cors({ origin: allowedOrigins }));

app.use(bodyParser.json());

app.get('/api/categories', async (req, res) => {
    console.log('GET /api/categories called');
    try {
        const categories = [
            { id: 'general_tech', name: 'General Tech', color: '#FF6B35' },
            { id: 'ai_ml', name: 'AI & ML', color: '#9C27B0' },
            { id: 'developer', name: 'Developer', color: '#2196F3' },
            { id: 'security', name: 'Security', color: '#F44336' },
            { id: 'cloud_devops', name: 'Cloud & DevOps', color: '#00BCD4' },
            { id: 'mobile', name: 'Mobile', color: '#4CAF50' },
            { id: 'hardware', name: 'Hardware', color: '#607D8B' },
            { id: 'web3', name: 'Web3', color: '#FFC107' },
            { id: 'company_blogs', name: 'Company Blogs', color: '#3F51B5' },
            { id: 'community', name: 'Community', color: '#E91E63' }
        ];
        res.status(200).json(categories);
    } catch (err) {
        res.status(500).send('Error retrieving categories: ' + err.message);
    }
});

app.get('/api/summaries', async (req, res) => {
    console.log('GET /api/summaries called');
    try {
        const { category, limit = 50, offset = 0 } = req.query;

        let query = db.collection('summaries').orderBy('created_at', 'desc');

        // Filter by category if provided
        if (category && category !== 'all') {
            query = query.where('category', '==', category);
        }

        // Apply pagination
        const snapshot = await query.limit(parseInt(limit)).offset(parseInt(offset)).get();

        const summaries = [];
        snapshot.forEach((doc) => {
            summaries.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(summaries);
    } catch (err) {
        res.status(500).send('Error retrieving summaries: ' + err.message);
    }
});

app.get('/api/summaries/:id', async (req, res) => {
    console.log('GET /api/summaries/:id called');
    try {
        const { id } = req.params;
        const doc = await db.collection('summaries').doc(id).get();

        if (doc.exists) {
            res.status(200).json({ id: doc.id, ...doc.data() });
        } else {
            res.status(404).json({ error: 'Summary not found' });
        }
    } catch (err) {
        res.status(500).send('Error retrieving summary: ' + err.message);
    }
});

app.get('/api/articles', async (req, res) => {
    console.log('GET /api/articles called');
    try {
        const articles = [];
        // Changed from 'ARTICLES' to 'summaries' to match what frontend expects
        const snapshot = await db.collection('summaries').orderBy('created_at', 'desc').get();

        snapshot.forEach((doc) => {
            articles.push({ id: doc.id, ...doc.data() });
        });

        res.status(200).json(articles);
    } catch (err) {
        res.status(500).send('Error retrieving articles: ' + err.message);
    }
});

app.get('/api/authors', async (req, res) => {
    console.log('get for authors');
    try {
        const authors = [];
        const snapshot = await db.collection('AUTHORS').get();
        snapshot.forEach((doc) => authors.push({ id: doc.id, ...doc.data() }));
        res.status(200).json(authors);
    } catch {
        res.status(500).send('Error retrieving articles: ' + err.message);
    }
});

app.get('/api/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await db.collection('AUTHORS').doc(id).get();
        if (author.exists) {
            res.status(200).json(author.data());
        } else {
            res.status(404).json({ error: 'Author not found' });
        }
    } catch (err) {
        res.status(500).send('Error retrieving author: ' + err.message);
    }
});


app.listen(PORT, () => console.log(`Server is running on port ${PORT}`));
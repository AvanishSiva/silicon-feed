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
    credential : admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL
});

const db = admin.firestore();

app.use(cors())
app.use(bodyParser.json());

app.get('/api/articles', async (req,res) => {
    console.log('get called');
    try{
        const articles= [];
        const snapshot = await db.collection('ARTICLES').get();

        for(const doc of snapshot.docs){
            const articleData = {id : doc.id, ...doc.data()}

            const authorRef = articleData.author;

            if(authorRef) {
                const authorDoc = await authorRef.get();
                articleData.author = { id: authorDoc.id, ...authorDoc.data() };
            }

            articles.push(articleData);
        }

        res.status(200).json(articles);
    }catch(err){
        res.status(500).send('Error retrieving articles: ' + err.message);
    }
});

app.get('/api/authors', async(req, res) => {
    console.log('get for authors');
    try{
        const authors= [];
        const snapshot = await db.collection('AUTHORS').get();
        snapshot.forEach((doc) => authors.push({ id: doc.id, ...doc.data() }));
        res.status(200).json(authors);
    }catch{
        res.status(500).send('Error retrieving articles: ' + err.message);
    }
});

app.get('/api/authors/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const author = await db.collection('AUTHORS').doc(id).get();
        if( author.exists){
            res.status(200).json(author.data());
        }else{
            res.status(404).json({ error: 'Author not found' });
        }
        res.status(200).json({ message: 'Article deleted successfully!' });
    } catch (err) {
        res.status(500).send('Error deleting article: ' + err.message);
    }
});
  

app.listen(PORT, ()=> console.log('Server is running'));
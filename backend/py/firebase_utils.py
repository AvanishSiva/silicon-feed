import firebase_admin
from firebase_admin import credentials, storage
import requests
import os
import uuid
from firebase_admin import firestore
from datetime import datetime, timedelta, timezone

# Global bucket and db references
bucket = None
db = None

def initialize_firebase(service_account_path='backend/serviceAccountKey.json', storage_bucket='siliconfeed-e4d06.firebasestorage.app'):
    """Initializes the Firebase Admin SDK. Call this once at startup."""
    global bucket, db
    
    # Check if a default app is already initialized to avoid errors on reload
    if not firebase_admin._apps:
        try:
            # Check if using a local file or environment variable (simpler for now)
            # Assuming the file is in the same directory or passed as absolute path
            if not os.path.exists(service_account_path):
                print(f"Warning: Service account key not found at {service_account_path}")
                return False

            cred = credentials.Certificate(service_account_path)
            firebase_admin.initialize_app(cred, {
                'storageBucket': storage_bucket
            })
            print("Firebase Admin SDK initialized.")
        except Exception as e:
            print(f"Failed to initialize Firebase: {e}")
            return False
    
    
    bucket = storage.bucket()
    db = firestore.client()
    return True

def upload_image_from_url(image_url, destination_folder='article_images'):
    """
    Downloads an image from a public URL and uploads it to Firebase Storage.
    Returns the public download URL.
    """
    global bucket
    if bucket is None:
        print("Firebase bucket not initialized. Call initialize_firebase() first.")
        return None

    if not image_url or image_url == "No image":
        return None

    try:
        # 1. Download the image
        print(f"Downloading image from: {image_url}")
        response = requests.get(image_url, stream=True, timeout=10)
        response.raise_for_status()
        
        # Get content type
        content_type = response.headers.get('content-type', 'image/jpeg')
        extension = '.jpg'
        if 'png' in content_type:
            extension = '.png'
        elif 'gif' in content_type:
            extension = '.gif'
        elif 'webp' in content_type:
            extension = '.webp'

        # 2. Upload to Firebase
        # Generate a unique filename
        filename = f"{destination_folder}/{uuid.uuid4()}{extension}"
        blob = bucket.blob(filename)
        
        blob.upload_from_string(
            response.content,
            content_type=content_type
        )
        
        # 3. Make public and return URL
        blob.make_public()
        print(f"Image uploaded to: {blob.public_url}")
        return blob.public_url

    except Exception as e:
        print(f"Error uploading image {image_url}: {e}")
        return None

def save_raw_article(article):
    """
    Saves a raw article to the 'raw_articles' collection in Firestore.
    Uses hash_id as the document ID to prevent duplicates.
    """
    global db
    if db is None:
        # Auto-initialize if needed (e.g. running from script)
        if not initialize_firebase():
             print("DB not initialized and failed to auto-init")
             return False

    try:
        # Ensure created_at is a datetime object
        if isinstance(article.get('created_at'), str):
             # Try to parse if string, or set to now
             article['created_at'] = datetime.now(timezone.utc)
        
        # Use hash_id as document ID to enforce uniqueness
        doc_ref = db.collection('raw_articles').document(article['hash_id'])
        doc_ref.set(article)
        print(f"Saved raw article: {article['title']}")
        return True
    except Exception as e:
        print(f"Error saving raw article {article.get('title')}: {e}")
        return False

def cleanup_old_articles(days=2):
    """
    Deletes raw articles older than 'days' from the 'raw_articles' collection.
    This prevents the collection from growing indefinitely.
    """
    global db
    if db is None:
        initialize_firebase()

    try:
        cutoff_date = datetime.now(timezone.utc) - timedelta(days=days)
        print(f"Cleaning up articles older than: {cutoff_date}")
        
        # specific to Firestore query
        docs = db.collection('raw_articles').where('created_at', '<', cutoff_date).stream()
        
        deleted_count = 0
        for doc in docs:
            doc.reference.delete()
            deleted_count += 1
            
        print(f"Deleted {deleted_count} old raw articles.")
        return deleted_count
    except Exception as e:
        print(f"Error cleaning up old articles: {e}")
        return 0

def fetch_raw_articles(start_date=None, end_date=None, category=None):
    """
    Fetches raw articles from Firestore for processing.
    """
    global db
    if db is None:
        initialize_firebase()

    try:
        query = db.collection('raw_articles')
        
        if category:
            query = query.where('category', '==', category)
            
        if start_date:
            query = query.where('created_at', '>=', start_date)
            
        if end_date:
            query = query.where('created_at', '<', end_date)
            
        return [doc.to_dict() for doc in query.stream()]
    except Exception as e:
        print(f"Error fetching raw articles: {e}")
        return []

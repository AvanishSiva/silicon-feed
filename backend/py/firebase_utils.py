import firebase_admin
from firebase_admin import credentials, storage
import requests
import os
import uuid

# Global bucket reference
bucket = None

def initialize_firebase(service_account_path='serviceAccountKey.json', storage_bucket='siliconfeed-e4d06.firebasestorage.app'):
    """Initializes the Firebase Admin SDK. Call this once at startup."""
    global bucket
    
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

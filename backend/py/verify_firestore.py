from firebase_utils import initialize_firebase
from firebase_admin import firestore
import os

# Initialize Firebase
json_path = os.path.join(os.path.dirname(__file__), '..', 'serviceAccountKey.json')
initialize_firebase(json_path)

# Get Firestore client
db = firestore.client()

# Read from summaries collection
summaries_ref = db.collection('summaries')
docs = summaries_ref.limit(5).stream()

print("Recent summaries from Firestore:")
print("=" * 60)

for doc in docs:
    data = doc.to_dict()
    print(f"\nTitle: {data.get('title')}")
    print(f"Created: {data.get('created_at')}")
    print(f"Image: {data.get('image')[:50]}..." if data.get('image') else "No image")
    print(f"Summary: {data.get('summary')[:100]}...")
    print("-" * 60)

print("\n✅ Successfully reading from Firestore!")


#This is a Setup file for MongoDB connection and collection creation
#Run it only once. make sure to drop the collectin before running it again.
from pymongo import MongoClient

def get_db_connection(uri="mongodb://localhost:27017/", db_name="silicon_feed"):
    client = MongoClient(uri)
    db = client[db_name]
    return db

def create_collection(db, collection_name):
    if collection_name not in db.list_collection_names():
        collection = db.create_collection(collection_name)
        collection.create_index("hash_id", unique=True)
        collection.create_index("tags")

        return collection
    return db[collection_name]

def save_article(article):
    db = get_db_connection()
    collection = db['articles']
    try:
        collection.insert_one(article)
        print(f"Article saved: {article['title']}")
    except Exception as e:
        print(f"Error saving article: {e}")

if __name__ == "__main__":
    db = get_db_connection()
    create_collection(db, 'articles')
    print("Connected to MongoDB database:", db.name)
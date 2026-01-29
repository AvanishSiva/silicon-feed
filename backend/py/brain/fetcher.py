from db import get_db_connection
from datetime import datetime, timedelta, timezone

def fetch_todays_articles():
    """Fetch all articles from today (backward compatible)"""
    db = get_db_connection()
    collection = db['articles']
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)

    articles = db.articles.find({
        'created_at': {
            '$gte': datetime.combine(today, datetime.min.time()),
            '$lt': datetime.combine(tomorrow, datetime.min.time())
        }
    })

    return list(articles)

def fetch_articles_by_category(category):
    """Fetch today's articles for a specific category"""
    db = get_db_connection()
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)

    articles = db.articles.find({
        'category': category,
        'created_at': {
            '$gte': datetime.combine(today, datetime.min.time()),
            '$lt': datetime.combine(tomorrow, datetime.min.time())
        }
    })

    return list(articles)

def fetch_all_articles_grouped():
    """Fetch all today's articles grouped by category"""
    db = get_db_connection()
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)

    all_articles = db.articles.find({
        'created_at': {
            '$gte': datetime.combine(today, datetime.min.time()),
            '$lt': datetime.combine(tomorrow, datetime.min.time())
        }
    })

    # Group by category
    grouped = {}
    for article in all_articles:
        category = article.get('category', 'general_tech')
        if category not in grouped:
            grouped[category] = []
        grouped[category].append(article)

    return grouped

def prepare_corpus(articles):
    corpus = []
    for article in articles:
        text = f"{article.get('title')}\n{article.get('description')}\n)"
        corpus.append(text)

    return corpus




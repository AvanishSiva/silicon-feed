# REMOVED: from db import get_db_connection
from firebase_utils import fetch_raw_articles
from datetime import datetime, timedelta, timezone

def fetch_todays_articles():
    """Fetch all articles from today (backward compatible)"""
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)
    
    start_date = datetime.combine(today, datetime.min.time())
    end_date = datetime.combine(tomorrow, datetime.min.time())

    return fetch_raw_articles(start_date, end_date)

def fetch_articles_by_category(category):
    """Fetch today's articles for a specific category"""
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)
    
    start_date = datetime.combine(today, datetime.min.time())
    end_date = datetime.combine(tomorrow, datetime.min.time())

    return fetch_raw_articles(start_date, end_date, category=category)

def fetch_all_articles_grouped():
    """Fetch all today's articles grouped by category"""
    today = datetime.now(timezone.utc).date()
    tomorrow = today + timedelta(days=1)
    
    start_date = datetime.combine(today, datetime.min.time())
    end_date = datetime.combine(tomorrow, datetime.min.time())

    all_articles = fetch_raw_articles(start_date, end_date)

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




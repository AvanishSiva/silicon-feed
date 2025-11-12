from db import get_db_connection
from datetime import datetime, timedelta

def fetch_todays_articles():
    db = get_db_connection()
    collection = db['articles']
    today = datetime.utcnow().date()
    tomorrow = today + timedelta(days=1)

    articles = db.articles.find({
        'created_at': {
            '$gte': datetime.combine(today, datetime.min.time()),
            '$lt': datetime.combine(tomorrow, datetime.min.time())
        }
    })

    return list(articles)

def prepare_corpus(articles):
    corpus = []
    for article in articles:
        text = f"{article.get('title')}\n{article.get('description')}\n)"
        corpus.append(text)

    return corpus



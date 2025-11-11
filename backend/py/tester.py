
from brain.fetcher import fetch_todays_articles

articles = fetch_todays_articles()
print(f"Today's articles count: {len(articles)}")
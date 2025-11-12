
from brain.fetcher import fetch_todays_articles
from brain.fetcher import prepare_corpus

articles = fetch_todays_articles()
print(f"Today's articles count: {len(articles)}")

corpuses = prepare_corpus(articles)
for corpus in corpuses:
    print(f"\nCorpus:\n{corpus}\n")


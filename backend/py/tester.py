from brain.pipeline import run_clustering
from brain.summarizer import run_summarization
# from brain.fetcher import fetch_todays_articles
# from brain.fetcher import prepare_corpus
# from brain.clustering import cluster_articles

# articles = fetch_todays_articles()
# print(f"Today's articles count: {len(articles)}")

# corpuses = prepare_corpus(articles)
# for corpus in corpuses:
#     print(f"\nCorpus:\n{corpus}\n")

# cluster_articles(corpuses, num_clusters=5)

run_summarization()

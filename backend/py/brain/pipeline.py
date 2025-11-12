from brain.fetcher import fetch_todays_articles, prepare_corpus
from brain.clustering import cluster_articles

def run_clustering():
    articles = fetch_todays_articles()
    print(f"Today's articles count: {len(articles)}")

    corpus = prepare_corpus(articles)
    clusters = cluster_articles(corpus, num_clusters=10)

    for cluster_id, article_indices in clusters.items():
        print(f"\nCluster {cluster_id}:")
        for idx in article_indices:
            print(f"- {articles[idx]['title']}")
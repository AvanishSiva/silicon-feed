from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer

def cluster_articles(corpus, num_clusters=10):
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X = vectorizer.fit_transform(corpus)

    k_means= KMeans(n_clusters=num_clusters, random_state=42)
    labels = k_means.fit_predict(X)

    clusters = {}

    for idx, label in enumerate(labels):
        clusters.setdefault(label, []).append(idx)

    print(f"Formed {len(clusters)} clusters.")
    return clusters
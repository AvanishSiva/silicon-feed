from sklearn.cluster import KMeans
from sklearn.feature_extraction.text import TfidfVectorizer

def cluster_articles(corpus, num_clusters=10):
    """Original clustering function (backward compatible)"""
    vectorizer = TfidfVectorizer(stop_words='english', max_features=5000)
    X = vectorizer.fit_transform(corpus)

    k_means= KMeans(n_clusters=num_clusters, random_state=42)
    labels = k_means.fit_predict(X)

    clusters = {}

    for idx, label in enumerate(labels):
        clusters.setdefault(label, []).append(idx)

    print(f"Formed {len(clusters)} clusters.")
    return clusters

def cluster_by_category(articles_by_category, clusters_per_category=5):
    """
    Cluster articles within each category separately.
    Returns: {category: {cluster_id: [article_indices]}}
    """
    all_clusters = {}
    
    for category, articles in articles_by_category.items():
        if len(articles) == 0:
            print(f"Skipping {category}: No articles")
            continue
        
        # Adaptive cluster count based on article volume
        num_articles = len(articles)
        if num_articles < 5:
            num_clusters = 1
        elif num_articles < 15:
            num_clusters = min(3, num_articles)
        else:
            num_clusters = min(clusters_per_category, num_articles // 3)
        
        # Prepare corpus for this category
        corpus = []
        for article in articles:
            text = f"{article.get('title')}\n{article.get('description')}\n"
            corpus.append(text)
        
        # Cluster
        try:
            vectorizer = TfidfVectorizer(stop_words='english', max_features=3000)
            X = vectorizer.fit_transform(corpus)
            
            k_means = KMeans(n_clusters=num_clusters, random_state=42)
            labels = k_means.fit_predict(X)
            
            clusters = {}
            for idx, label in enumerate(labels):
                clusters.setdefault(label, []).append(idx)
            
            all_clusters[category] = clusters
            print(f"{category}: {len(articles)} articles → {len(clusters)} clusters")
        
        except Exception as e:
            print(f"Error clustering {category}: {e}")
            # Fallback: put all articles in one cluster
            all_clusters[category] = {0: list(range(len(articles)))}
    
    return all_clusters
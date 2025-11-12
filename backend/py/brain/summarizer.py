from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer

from brain.fetcher import fetch_todays_articles, prepare_corpus
from brain.clustering import cluster_articles


def build_cluster_text(articles, cluster_indices):
    combined_text = ""
    for idx in cluster_indices:
        article = articles[idx]
        text_parts = [
            article.get('title'),
            article.get('description'),
            "".join(article.get('tags', []))
        ]

        combined_text += " ".join(text_parts) + "." 
        return combined_text


def summarize_text(text, sentence_count = 10):
    parser = PlaintextParser.from_string(text, Tokenizer("english"))
    summarizer = TextRankSummarizer()
    summary_sentence = summarizer(parser.document, sentence_count)
    summary = " ".join([str(sentence) for sentence in summary_sentence])
    return summary 

def run_summarization():
    articles = fetch_todays_articles()

    corpus = prepare_corpus(articles)
    clusters = cluster_articles(corpus, num_clusters=10)

    print("=== Daily Summary ===")
    for cluster_id, article_indices in clusters.items():
        combined_text = build_cluster_text(articles, article_indices)
        summary = summarize_text(combined_text, sentence_count=5)
        print(f"\n--- Cluster {cluster_id} Summary ---")
        print(summary)
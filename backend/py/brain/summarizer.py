from sumy.parsers.plaintext import PlaintextParser
from sumy.nlp.tokenizers import Tokenizer
from sumy.summarizers.text_rank import TextRankSummarizer

from brain.fetcher import fetch_todays_articles, prepare_corpus
from brain.clustering import cluster_articles

from transformers import AutoTokenizer, AutoModelForSeq2SeqLM

from datetime import datetime
from firebase_utils import initialize_firebase, upload_image_from_url
import os
from firebase_admin import firestore

# Initialize Firebase (Best to do this at module level or start of run)
# Ensure you have the json file in the same directory or provide path
json_path = os.path.join(os.path.dirname(__file__), '..', '..', 'serviceAccountKey.json')
initialize_firebase(json_path)

# Initialize Firestore client
db = firestore.client()



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

import requests
import json

# Ollama API endpoint
OLLAMA_API = "http://localhost:11434/api/generate"
MODEL_NAME = "llama3.1:8b"

def generate_with_ollama(prompt, max_tokens=500):
    """Helper function to call Ollama API"""
    payload = {
        "model": MODEL_NAME,
        "prompt": prompt,
        "stream": False,
        "options": {
            "temperature": 0.7,
            "num_predict": max_tokens
        }
    }
    
    try:
        response = requests.post(OLLAMA_API, json=payload, timeout=120)
        response.raise_for_status()
        return response.json().get('response', '').strip()
    except Exception as e:
        print(f"Error calling Ollama: {e}")
        return ""

def generate_title(summary):
    """Generate a compelling, professional headline"""
    prompt = f"""You are a professional news editor. Write ONE compelling, concise headline (maximum 10 words) for this news story:

{summary}

Headline:"""
    title = generate_with_ollama(prompt, max_tokens=30)
    # Take only the first line if multiple lines are returned
    return title.split('\n')[0].strip()

def generate_description(summary):
    """Generate a brief, engaging description/lead paragraph"""
    prompt = f"""You are a professional journalist. Write a brief, engaging 2-3 sentence description for this news story:

{summary}

Description:"""
    return generate_with_ollama(prompt, max_tokens=100)

def generate_article(summary):
    """Generate a full, detailed article"""
    prompt = f"""You are a professional tech journalist. Write a comprehensive, well-structured news article (300-400 words) about the following topic:

{summary}

Write the article with:
- An engaging introduction that hooks the reader
- Clear explanation of key facts and details
- Relevant context and background information
- Analysis of implications or significance
- A strong conclusion

Use a professional journalistic tone. Be factual and informative.

Article:"""
    return generate_with_ollama(prompt, max_tokens=600)

def run_summarization():
    """Run category-based summarization pipeline"""
    # Fetch articles grouped by category
    from brain.fetcher import fetch_all_articles_grouped
    from brain.clustering import cluster_by_category
    
    articles_by_category = fetch_all_articles_grouped()
    
    if not articles_by_category:
        print("No articles found for today!")
        return
    
    print(f"\n{'='*60}")
    print(f"CATEGORY-BASED SUMMARIZATION")
    print(f"{'='*60}")
    
    # Cluster articles within each category
    all_clusters = cluster_by_category(articles_by_category, clusters_per_category=5)
    
    total_summaries = 0
    
    # Process each category
    for category, clusters in all_clusters.items():
        articles = articles_by_category[category]
        
        print(f"\n{'='*60}")
        print(f"Processing Category: {category.upper().replace('_', ' ')}")
        print(f"{'='*60}")
        
        for cluster_id, article_indices in clusters.items():
            combined_text = build_cluster_text(articles, article_indices)
            summary = summarize_text(combined_text, sentence_count=5)

            # Generate title, description, and full article with category context
            print(f"Generating content for {category} cluster {cluster_id}...")
            
            # Category-aware prompts
            category_name = category.replace('_', ' ').title()
            title = generate_title_with_category(summary, category_name)
            description = generate_description(summary)
            article_content = generate_article(summary)

            # Image Handling
            source_image_url = None
            for idx in article_indices:
                img = articles[idx].get('image')
                if img and img != "No image":
                    source_image_url = img
                    break
            
            # Upload to Firebase
            firebase_image_url = "https://placehold.co/600x400?text=No+Image"
            if source_image_url:
                print(f"Uploading image for {category} cluster {cluster_id}...")
                uploaded_url = upload_image_from_url(source_image_url)
                if uploaded_url:
                    firebase_image_url = uploaded_url

            # Adding to Firestore database with category
            doc_ref = db.collection('summaries').document()
            doc_ref.set({
                'title': title,
                'description': description,
                'article': article_content,
                'summary': summary,
                'image': firebase_image_url,
                'category': category,  # NEW: Category field
                'source_articles_count': len(article_indices),  # NEW: How many articles contributed
                'created_at': firestore.SERVER_TIMESTAMP
            })

            print(f"\n{'='*60}")
            print(f"CATEGORY: {category_name}")
            print(f"TITLE: {title}")
            print(f"{'='*60}")
            print(f"DESCRIPTION: {description}")
            print(f"\nARTICLE:\n{article_content}")
            print(f"{'='*60}\n")
            
            total_summaries += 1
    
    print(f"\n{'='*60}")
    print(f"SUMMARIZATION COMPLETE")
    print(f"{'='*60}")
    print(f"Total summaries generated: {total_summaries}")
    print(f"Categories processed: {len(all_clusters)}")
    print(f"{'='*60}\n")

def generate_title_with_category(summary, category_name):
    """Generate a compelling, professional headline with category context"""
    prompt = f"""You are a professional news editor for a {category_name} publication. Write ONE compelling, concise headline (maximum 10 words) for this news story:

{summary}

Headline:"""
    title = generate_with_ollama(prompt, max_tokens=30)
    return title.split('\n')[0].strip()


if __name__ == "__main__":
    run_summarization()


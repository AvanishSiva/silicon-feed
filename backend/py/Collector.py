import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import hashlib
from db import save_article

def get_requests(url):
    try:
        headers = {
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) "
                          "AppleWebKit/537.36 (KHTML, like Gecko) "
                          "Chrome/129.0.0.0 Safari/537.36",
            "Accept": "application/rss+xml,application/xml;q=0.9,*/*;q=0.8",
            "Accept-Encoding": "gzip, deflate, br",
            "Connection": "close", 
        }
        response = requests.get(url, headers=headers, timeout=10)
        response.raise_for_status()
        
        content = response.content.decode('utf-8', errors='replace')
        return content
    except Exception as e:
        print(f"Error fetching {url}: {e}")
        return None

def get_article_hash(url):
    return hashlib.sha256(url.encode()).hexdigest()

def parse_rss_feed(root):
    """Parse RSS 2.0 format feeds"""
    articles = []
    
    for item in root.findall('.//item'):
        title = item.find('title')
        title = title.text if title is not None and title.text else "No title"
        
        link = item.find('link')
        link = link.text if link is not None and link.text else "No link"
        
        # Try description first, then content:encoded
        description = item.find('description')
        if description is None or not description.text:
            # Try content:encoded for feeds that use it
            description = item.find('.//{http://purl.org/rss/1.0/modules/content/}encoded')
        
        if description is not None and description.text:
            description_text = BeautifulSoup(description.text, "html.parser").get_text(separator="\n", strip=True)
        else:
            description_text = "No description"
        
        # Try different author formats
        author = item.find('author')
        if author is None:
            author = item.find('{http://purl.org/dc/elements/1.1/}creator')
        author = author.text if author is not None and author.text else "Unknown"
        
        hash_id = get_article_hash(link)
        
        # Get categories/tags
        tags = [tag.text for tag in item.findall('category') if tag.text]
        
        articles.append({
            'title': title,
            'link': link,
            'description': description_text,
            'author': author,
            'hash_id': hash_id,
            'tags': tags
        })
    
    return articles

def parse_atom_feed(root):
    """Parse Atom format feeds"""
    articles = []
    namespaces = {'atom': 'http://www.w3.org/2005/Atom'}
    
    for entry in root.findall('.//atom:entry', namespaces):
        title = entry.find('atom:title', namespaces)
        title = title.text if title is not None and title.text else "No title"
        
        # Get link with rel="alternate" or first link
        link = entry.find('atom:link[@rel="alternate"]', namespaces)
        if link is None:
            link = entry.find('atom:link', namespaces)
        link = link.get('href') if link is not None else "No link"
        
        # Try content first, then summary
        content = entry.find('atom:content', namespaces)
        if content is None:
            content = entry.find('atom:summary', namespaces)
        
        if content is not None and content.text:
            description_text = BeautifulSoup(content.text, "html.parser").get_text(separator="\n", strip=True)
        else:
            description_text = "No description"
        
        # Get author
        author_elem = entry.find('atom:author', namespaces)
        if author_elem is not None:
            author_name = author_elem.find('atom:name', namespaces)
            author = author_name.text if author_name is not None else "Unknown"
        else:
            author = "Unknown"
        
        hash_id = get_article_hash(link)
        
        # Get categories
        tags = [cat.get('term') for cat in entry.findall('atom:category', namespaces) if cat.get('term')]
        
        articles.append({
            'title': title,
            'link': link,
            'description': description_text,
            'author': author,
            'hash_id': hash_id,
            'tags': tags
        })
    
    return articles

def get_articles_from_feed(feed_url):
    """Universal feed parser that handles both RSS and Atom formats"""
    response = get_requests(feed_url)
    articles = []
    
    if response:
        try:
            root = ET.fromstring(response)
            
            # Detect feed type and parse accordingly
            if root.tag == '{http://www.w3.org/2005/Atom}feed' or root.tag == 'feed':
                articles = parse_atom_feed(root)
            elif root.tag == 'rss' or root.find('.//item') is not None:
                articles = parse_rss_feed(root)
            else:
                print(f"Unknown feed format for {feed_url}")
        except ET.ParseError as e:
            print(f"XML parsing error for {feed_url}: {e}")
        except Exception as e:
            print(f"Error parsing {feed_url}: {e}")
    
    return articles

if __name__ == "__main__":
    feeds = {
        'TechCrunch': 'http://feeds.feedburner.com/TechCrunch/',
        'The Verge': 'https://www.theverge.com/rss/index.xml',
        'Ars Technica': 'https://feeds.arstechnica.com/arstechnica/index/',
        'Mashable': 'http://feeds.mashable.com/Mashable',
        'Engadget': 'https://www.engadget.com/rss.xml',
        'VentureBeat': 'https://venturebeat.com/feed',
        'Gizmodo': 'https://gizmodo.com/feed'
    }
    
    all_articles = []
    
    for source_name, feed_url in feeds.items():
        print(f"\nFetching articles from {source_name}...")
        articles = get_articles_from_feed(feed_url)
        all_articles.extend(articles)
        print(f"Found {len(articles)} articles from {source_name}")
        \
        # Print first article as sample
        if articles:
            print(f"\nSample article:")
            print(f"  Title: {articles[0]['title'][:80]}...")
            print(f"  Author: {articles[0]['author']}")
            print(f"  Link: {articles[0]['link']}")
            print(f"  Tags: {', '.join(articles[0]['tags'][:5])}")
    
    # Summary
    print("\n" + "="*50)
    print("SUMMARY")
    print("="*50)

    #Insert into MongoDB. 
    for article in all_articles:
        save_article(article)
    print(f"\nTotal articles fetched: {len(all_articles)}")


import requests
import xml.etree.ElementTree as ET
from bs4 import BeautifulSoup
import hashlib
from db import save_article
from datetime import datetime, timezone

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

        # Extract Image
        image_url = None
        # 1. Try media:content
        media = item.find('{http://search.yahoo.com/mrss/}content')
        if media is not None:
            image_url = media.get('url')
        
        # 2. Try enclosure
        if not image_url:
            enclosure = item.find('enclosure')
            if enclosure is not None and enclosure.get('type', '').startswith('image'):
                image_url = enclosure.get('url')
        
        # 3. Try parsing description for <img src="...">
        if not image_url and description is not None and description.text:
            soup = BeautifulSoup(description.text, "html.parser")
            img_tag = soup.find('img')
            if img_tag:
                image_url = img_tag.get('src')
        
        if not image_url:
            image_url = "No image"
        
        # Get categories/tags
        tags = [tag.text for tag in item.findall('category') if tag.text]
        
        articles.append({
            'title': title,
            'link': link,
            'description': description_text,
            'author': author,
            'image': image_url,
            'hash_id': hash_id,
            'tags': tags,
            'created_at' : datetime.now(timezone.utc)
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

        # Extract Image
        image_url = None
        # 1. Try link with rel="enclosure" and type="image/..."
        # Note: Namespaces in findall can be tricky, iterating all links is safer if specific query fails
        for l in entry.findall('atom:link', namespaces):
            if l.get('rel') == 'enclosure' and l.get('type', '').startswith('image'):
                image_url = l.get('href')
                break
        
        # 2. Try parsing content/summary for <img src="...">
        if not image_url:
            html_content = None
            if content is not None and content.text:
                html_content = content.text
            elif entry.find('atom:summary', namespaces) is not None:
                sm = entry.find('atom:summary', namespaces)
                if sm.text:
                    html_content = sm.text
            
            if html_content:
                soup = BeautifulSoup(html_content, "html.parser")
                img_tag = soup.find('img')
                if img_tag:
                    image_url = img_tag.get('src')

        if not image_url:
            image_url = "No image"
        
        # Get categories
        tags = [cat.get('term') for cat in entry.findall('atom:category', namespaces) if cat.get('term')]
        
        articles.append({
            'title': title,
            'link': link,
            'description': description_text,
            'author': author,
            'image': image_url,
            'hash_id': hash_id,
            'tags': tags,
            'created_at' : datetime.now(timezone.utc)
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
    # Categorized RSS Feeds - 150+ Free Sources
    FEED_CATEGORIES = {
        'general_tech': {
            'TechCrunch': 'https://techcrunch.com/feed/',
            'The Verge': 'https://www.theverge.com/rss/index.xml',
            'Ars Technica': 'https://feeds.arstechnica.com/arstechnica/index',
            'Wired': 'https://www.wired.com/feed/rss',
            'CNET': 'https://www.cnet.com/rss/news/',
            'ZDNet': 'https://www.zdnet.com/news/rss.xml',
            'Engadget': 'https://www.engadget.com/rss.xml',
            'VentureBeat': 'https://venturebeat.com/feed/',
            'Gizmodo': 'https://gizmodo.com/feed',
            'Mashable Tech': 'https://mashable.com/feeds/rss/tech',
            'Fast Company Tech': 'https://www.fastcompany.com/technology/rss',
            'Inc Technology': 'https://www.inc.com/rss/technology',
            'Slashdot': 'http://rss.slashdot.org/Slashdot/slashdotMain',
            'Y Combinator': 'https://news.ycombinator.com/rss',
            'Product Hunt': 'https://www.producthunt.com/feed',
        },
        
        'ai_ml': {
            'MIT Tech Review': 'https://www.technologyreview.com/feed/',
            'AI News': 'https://www.artificialintelligence-news.com/feed/',
            'Towards Data Science': 'https://towardsdatascience.com/feed',
            'KDnuggets': 'https://www.kdnuggets.com/feed',
            'OpenAI Blog': 'https://openai.com/blog/rss/',
            'Google AI Blog': 'https://blog.google/technology/ai/rss/',
            'DeepMind': 'https://deepmind.google/blog/rss.xml',
            'Hugging Face': 'https://huggingface.co/blog/feed.xml',
            'Papers with Code': 'https://paperswithcode.com/rss.xml',
            'Machine Learning Mastery': 'https://machinelearningmastery.com/feed/',
            'Analytics Vidhya': 'https://www.analyticsvidhya.com/feed/',
            'Distill.pub': 'https://distill.pub/rss.xml',
        },
        
        'developer': {
            'Hacker News': 'https://hnrss.org/frontpage',
            'Dev.to': 'https://dev.to/feed',
            'GitHub Blog': 'https://github.blog/feed/',
            'GitLab Blog': 'https://about.gitlab.com/atom.xml',
            'Stack Overflow Blog': 'https://stackoverflow.blog/feed/',
            'freeCodeCamp': 'https://www.freecodecamp.org/news/rss/',
            'CSS-Tricks': 'https://css-tricks.com/feed/',
            'Smashing Magazine': 'https://www.smashingmagazine.com/feed/',
            'A List Apart': 'https://alistapart.com/main/feed/',
            'SitePoint': 'https://www.sitepoint.com/feed/',
            'Codrops': 'https://tympanus.net/codrops/feed/',
            'Go Blog': 'https://go.dev/blog/feed.atom',
            'Rust Blog': 'https://blog.rust-lang.org/feed.xml',
            'Python Weekly': 'https://www.pythonweekly.com/rss.xml',
            'JavaScript Weekly': 'https://javascriptweekly.com/rss/',
        },
        
        'security': {
            'Krebs on Security': 'https://krebsonsecurity.com/feed/',
            'The Hacker News': 'https://feeds.feedburner.com/TheHackersNews',
            'Bleeping Computer': 'https://www.bleepingcomputer.com/feed/',
            'Dark Reading': 'https://www.darkreading.com/rss_simple.asp',
            'Threatpost': 'https://threatpost.com/feed/',
            'Schneier on Security': 'https://www.schneier.com/feed/atom/',
            'Security Week': 'https://www.securityweek.com/feed/',
            'Naked Security': 'https://nakedsecurity.sophos.com/feed/',
            'Troy Hunt': 'https://www.troyhunt.com/rss/',
            'SANS ISC': 'https://isc.sans.edu/rssfeed.xml',
        },
        
        'cloud_devops': {
            'AWS News': 'https://aws.amazon.com/blogs/aws/feed/',
            'Google Cloud Blog': 'https://cloud.google.com/blog/rss',
            'Azure Blog': 'https://azure.microsoft.com/en-us/blog/feed/',
            'DigitalOcean': 'https://www.digitalocean.com/blog/feed.xml',
            'Docker Blog': 'https://www.docker.com/blog/feed/',
            'Kubernetes Blog': 'https://kubernetes.io/feed.xml',
            'HashiCorp Blog': 'https://www.hashicorp.com/blog/feed.xml',
            'Red Hat Blog': 'https://www.redhat.com/en/rss/blog',
            'Heroku Blog': 'https://blog.heroku.com/feed',
            'Cloudflare Blog': 'https://blog.cloudflare.com/rss/',
        },
        
        'mobile': {
            'Android Developers': 'https://android-developers.googleblog.com/feeds/posts/default',
            'Android Authority': 'https://www.androidauthority.com/feed/',
            'Android Police': 'https://www.androidpolice.com/feed/',
            '9to5Mac': 'https://9to5mac.com/feed/',
            '9to5Google': 'https://9to5google.com/feed/',
            'iOS Dev Weekly': 'https://iosdevweekly.com/issues.rss',
            'React Native Blog': 'https://reactnative.dev/blog/rss.xml',
            'Flutter Blog': 'https://medium.com/flutter/feed',
            'Swift by Sundell': 'https://www.swiftbysundell.com/feed.rss',
            'Mobile Dev Memo': 'https://mobiledevmemo.com/feed/',
        },
        
        'hardware': {
            'AnandTech': 'https://www.anandtech.com/rss/',
            'Tom\'s Hardware': 'https://www.tomshardware.com/feeds/all',
            'PC Gamer': 'https://www.pcgamer.com/rss/',
            'Raspberry Pi': 'https://www.raspberrypi.org/blog/feed/',
            'Arduino Blog': 'https://blog.arduino.cc/feed/',
            'Hackaday': 'https://hackaday.com/feed/',
            'Make Magazine': 'https://makezine.com/feed/',
            'Adafruit': 'https://blog.adafruit.com/feed/',
            'IEEE Spectrum': 'https://spectrum.ieee.org/feeds/feed.rss',
            'Electronics Weekly': 'https://www.electronicsweekly.com/feed/',
        },
        
        'web3': {
            'CoinDesk': 'https://www.coindesk.com/arc/outboundfeeds/rss/',
            'Cointelegraph': 'https://cointelegraph.com/rss',
            'Decrypt': 'https://decrypt.co/feed',
            'Bitcoin Magazine': 'https://bitcoinmagazine.com/.rss/full/',
            'Ethereum Blog': 'https://blog.ethereum.org/feed.xml',
            'CryptoSlate': 'https://cryptoslate.com/feed/',
            'The Block': 'https://www.theblockcrypto.com/rss.xml',
            'Web3 Foundation': 'https://medium.com/web3foundation/feed',
        },
        
        'company_blogs': {
            'Netflix Tech': 'https://netflixtechblog.com/feed',
            'Uber Engineering': 'https://eng.uber.com/feed/',
            'Airbnb Engineering': 'https://medium.com/airbnb-engineering/feed',
            'Spotify Engineering': 'https://engineering.atspotify.com/feed/',
            'LinkedIn Engineering': 'https://engineering.linkedin.com/blog.rss',
            'Stripe Blog': 'https://stripe.com/blog/feed.rss',
            'Shopify Engineering': 'https://shopify.engineering/feed.xml',
            'Dropbox Tech': 'https://dropbox.tech/feed',
            'Pinterest Engineering': 'https://medium.com/@Pinterest_Engineering/feed',
            'Slack Engineering': 'https://slack.engineering/feed/',
            'Twitter Engineering': 'https://blog.twitter.com/engineering/en_us/blog.rss',
            'Meta Engineering': 'https://engineering.fb.com/feed/',
            'Atlassian Blog': 'https://www.atlassian.com/blog/feed',
            'Square Engineering': 'https://developer.squareup.com/blog/rss.xml',
            'Etsy Engineering': 'https://www.etsy.com/codeascraft/rss',
        },
        
        'community': {
            'r/technology': 'https://www.reddit.com/r/technology/.rss',
            'r/programming': 'https://www.reddit.com/r/programming/.rss',
            'r/MachineLearning': 'https://www.reddit.com/r/MachineLearning/.rss',
            'r/webdev': 'https://www.reddit.com/r/webdev/.rss',
            'r/javascript': 'https://www.reddit.com/r/javascript/.rss',
            'r/python': 'https://www.reddit.com/r/python/.rss',
            'r/startups': 'https://www.reddit.com/r/startups/.rss',
            'r/netsec': 'https://www.reddit.com/r/netsec/.rss',
            'r/datascience': 'https://www.reddit.com/r/datascience/.rss',
            'r/devops': 'https://www.reddit.com/r/devops/.rss',
        }
    }
    
    all_articles = []
    category_stats = {}
    
    # Process each category
    for category, feeds in FEED_CATEGORIES.items():
        print(f"\n{'='*60}")
        print(f"CATEGORY: {category.upper().replace('_', ' ')}")
        print(f"{'='*60}")
        
        category_articles = []
        
        for source_name, feed_url in feeds.items():
            print(f"\nFetching from {source_name}...")
            articles = get_articles_from_feed(feed_url)
            
            # Add category and source_name to each article
            for article in articles:
                article['category'] = category
                article['source_name'] = source_name
            
            category_articles.extend(articles)
            all_articles.extend(articles)
            print(f"✓ Found {len(articles)} articles from {source_name}")
        
        category_stats[category] = len(category_articles)
        print(f"\n{category.upper()}: Total {len(category_articles)} articles")
    
    # Summary
    print("\n" + "="*60)
    print("COLLECTION SUMMARY")
    print("="*60)
    
    for category, count in category_stats.items():
        print(f"{category.replace('_', ' ').title():.<40} {count:>4} articles")
    
    print(f"\n{'TOTAL ARTICLES':.<40} {len(all_articles):>4}")
    print("="*60)

    # Insert into MongoDB
    print("\nSaving to database...")
    saved_count = 0
    for article in all_articles:
        save_article(article)
        saved_count += 1
    
    print(f"\n✓ Successfully saved {saved_count} articles to database!")
    print(f"✓ Categories: {len(FEED_CATEGORIES)}")
    print(f"✓ Sources: {sum(len(feeds) for feeds in FEED_CATEGORIES.values())}")

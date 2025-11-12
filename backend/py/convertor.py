from db import get_db_connection
import json
import os

def fetch_all_summaries():
    db = get_db_connection()
    collection = db['summaries']
    summaries = collection.find().sort('created_at', -1)
    return list(summaries)

def save_summary_to_json(summaries):
    summaries_list = []
    for summary in summaries:
        json_summary = {
            'id' : summary.get('_id').__str__(),
            'title' : summary.get('title'),
            'image' : 'https://images.pexels.com/photos/3342739/pexels-photo-3342739.jpeg?_gl=1*az0z2*_ga*OTE0MDY1NjAyLjE3NjI5NDI1NTk.*_ga_8JE65Q40S6*czE3NjI5NDI1NTgkbzEkZzEkdDE3NjI5NDI2NjkkajM4JGwwJGgw',
            'summary' : summary.get('summary'),
            'created_at' : summary.get('created_at'),
            "author": {
                "id": "z8bZPnlfKRcGajGe4oQr",
                "name": "Coco",
                "description": "A bot",
                "mail": "sivaavanishk@gmail.com",
                "github": "https://github.com/AvanishSiva",
                "linkedIn": "https://www.linkedin.com/in/sivaavanish-k-5b6899203/"
            }
        }

        summaries_list.append(json_summary)

        current_dir = os.path.dirname(os.path.abspath(__file__))

        folder_path = os.path.join(current_dir, '..', '..', 'src', 'assets')
        folder_path = os.path.normpath(folder_path)  

        os.makedirs(folder_path, exist_ok=True)

        file_path = os.path.join(folder_path, 'summaries.json')
        with open(file_path, 'w') as f:
            json.dump(summaries_list, f, default=str, indent=4)
        print("Summaries saved to summaries.json")


if __name__ == "__main__":
    summaries = fetch_all_summaries()
    save_summary_to_json(summaries)
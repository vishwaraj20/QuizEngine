import urllib.request
import re
from bs4 import BeautifulSoup

url = "https://www.upsc.gov.in/examinations/previous-question-papers"
headers = {'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}

req = urllib.request.Request(url, headers=headers)
try:
    with urllib.request.urlopen(req) as response:
        html = response.read().decode('utf-8')
        soup = BeautifulSoup(html, 'html.parser')
        links = soup.find_all('a', href=True)
        print("All PDF links found on the main page:")
        for link in links:
            href = link['href']
            text = link.get_text(strip=True)
            if '.pdf' in href.lower():
                print(f"Text: {text} | Link: {href}")
except Exception as e:
    print("Error:", e)

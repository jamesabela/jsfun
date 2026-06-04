import urllib.request
import re

url = "https://docs.google.com/forms/d/e/1FAIpQLSfp15MltxxDgZ3Zz_P-SiwGi58V7s9wBAwCegUD_NiejMxK7A/viewform"
req = urllib.request.Request(
    url, 
    headers={'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)'}
)

try:
    with urllib.request.urlopen(req) as response:
        content = response.read().decode('utf-8')
    
    # Look for FB_PUBLIC_LOAD_DATA_
    match = re.search(r'FB_PUBLIC_LOAD_DATA_\s*=\s*(.*?);', content)
    if match:
        data_str = match.group(1)
        null = None
        true = True
        false = False
        data = eval(data_str)
        # Structure of FB_PUBLIC_LOAD_DATA_ in google forms:
        # data[1][1] contains list of form items
        items = data[1][1]
        for item in items:
            title = item[1]
            entry_id = None
            if len(item) > 4 and item[4] is not None:
                sub = item[4][0]
                if len(sub) > 0:
                    entry_id = sub[0]
            print(f"Title: {title}, Entry ID: {entry_id}")
    else:
        print("FB_PUBLIC_LOAD_DATA_ not found")
except Exception as e:
    print("Error:", e)

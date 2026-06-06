import os

workspace_dir = "/Users/abela.j/Documents/antigravcode/jsfun"
analytics_script = """<script async defer src="https://scripts.simpleanalyticscdn.com/latest.js"></script>
<noscript><img src="https://queue.simpleanalyticscdn.com/noscript.gif" alt="" referrerpolicy="no-referrer-when-downgrade" /></noscript>"""

count = 0
modified_files = []

for root, dirs, files in os.walk(workspace_dir):
    # Skip hidden folders and common dependency folders
    dirs[:] = [d for d in dirs if not d.startswith('.') and d != 'node_modules']
    
    for file in files:
        if file.endswith('.html'):
            filepath = os.path.join(root, file)
            # Skip this scratch script if we rename it to html (unlikely)
            try:
                with open(filepath, 'r', encoding='utf-8', errors='ignore') as f:
                    content = f.read()
                
                # Check if it already has the script
                if "scripts.simpleanalyticscdn.com/latest.js" in content:
                    continue
                    
                # Find </body> (case-insensitive)
                pos = content.lower().rfind("</body>")
                if pos != -1:
                    new_content = content[:pos] + analytics_script + "\n" + content[pos:]
                    with open(filepath, 'w', encoding='utf-8') as f:
                        f.write(new_content)
                    count += 1
                    modified_files.append(filepath)
            except Exception as e:
                print(f"Error processing {filepath}: {e}")

print(f"Successfully modified {count} HTML files:")
for path in modified_files:
    print(f" - {path}")

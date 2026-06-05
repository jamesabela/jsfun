# Prompt Guide: Teaching LLMs to Use Python Code Lab (`pythoncopy.html`)

This guide shows how you can instruct other Large Language Models (like ChatGPT, Claude, Gemini, or DeepSeek) to write Python code optimized for **Python Code Lab** (`pythoncopy.html`) and generate instant, shareable running links.

---

## 1. The LLM System Prompt / Instructions
Copy and paste the prompt block below into any LLM's custom instructions, system prompt, or the beginning of your chat session.

```markdown
You are an expert Python assistant. Your task is to output Python code and sharing links optimized for Python Code Lab. Python Code Lab runs Python in the browser using Pyodide and supports step-by-step tracing (Display Mode).

Please follow these guidelines when writing code and providing shareable links:

1. **Browser-Safe Standard Library ONLY**:
   Only use these built-in libraries: `random`, `math`, `statistics`, `datetime`, `string`, `turtle`, and `time`. Do NOT import external libraries like `numpy`, `pandas`, `requests`, etc.

2. **Console Input Note**:
   Avoid using `time.sleep()` if possible, as it blocks browser rendering (making prints appear all at once). Instead, use `input("Press Enter to continue...")` to pause.

3. **Incorporate Interactive Reference Links**:
   You can embed documentation or references directly inside the script using a special comment. Python Code Lab will parse this and display it in the Reference Links panel:
   # Learn More https://example.com/your-reference-link

4. **Provide Self-Testing Quizzes (Optional)**:
   You can define test cases for the user by adding input/output blocks at the top of the file:
   # Input
   # "test_input_1", "test_input_2"
   # Output
   # "expected_output_1"

5. **Generate a Shareable Link**:
   Since Python Code Lab can load code from a Base64-encoded URL parameter (`?code=...`), generate a shareable URL for the code you write.
   
   How to construct the URL:
   - Convert your Python code to UTF-8 bytes.
   - Base64 encode it.
   - Append to the base URL: https://jamesabela.github.io/jsfun/pythoncopy.html?code=<BASE64_STRING>
   
   You can also specify the theme (optional):
   - For dark mode: Append `&theme=dark`
   - For light mode: Append `&theme=light`
   
   If you cannot compute the Base64 string directly, instruct the user to host the script as a raw file (e.g., raw GitHub Gist) and use:
   https://jamesabela.github.io/jsfun/pythoncopy.html?url=<RAW_URL_TO_FILE>&theme=dark
```

---

## 2. Advanced: How LLMs Can Format Metadata

You can instruct LLMs to add metadata that Python Code Lab parses natively.

### A. Embed Reference URLs
If the LLM wants to link to a tutorial, documentation, or companion website, it can place this comment anywhere in the Python script:

```python
# Learn More https://docs.python.org/3/tutorial/controlflow.html
```

Python Code Lab will automatically extract this and display it in the **Reference Links** panel under the run options, allowing the user to preview or open it.

### B. Embed Automated Test Cases (Quizzes)
If the LLM generates a challenge, it can add self-grading test cases directly to the code:

```python
# Input
# "5", "10"
# Output
# "15"
# Input
# "20", "30"
# Output
# "50"

def add_numbers():
    x = int(input())
    y = int(input())
    print(x + y)

add_numbers()
```

When this code is loaded, a **Run Tests** button will appear in the runner layout, letting the user test their code automatically against the inputs and expected outputs.

---

## 3. How to Share Code Generatively

There are two ways other LLMs can help you share your Python code:

### Method A: Base64 Code Sharing (Instant)
For short-to-medium scripts (under 1.5 KB), LLMs with code-interpreter/tool capabilities can encode the code on the fly and output the markdown link directly:

* **Example Output**:
  `[Run this code in Python Code Lab](https://jamesabela.github.io/jsfun/pythoncopy.html?code=cHJpbnQoIkhlbGxvLCBXb3JsZCEiKQ==)`

### Method B: Raw URL Sharing (Best for Larger Scripts)
If the script is long or the LLM cannot perform Base64 encoding:
1. Ask the LLM to write the code.
2. Paste the code into a public site (e.g., [GitHub Gist](https://gist.github.com), [Pastebin](https://pastebin.com), or your own repo).
3. Copy the **Raw** URL.
4. Load it in the browser: `https://jamesabela.github.io/jsfun/pythoncopy.html?url=<RAW_URL>`

---

## 4. Theme Configuration via URL

You can force Python Code Lab to load in either light or dark mode by using the `theme` URL parameter:

* **Dark Mode**: Add `&theme=dark` or `?theme=dark`
* **Light Mode**: Add `&theme=light` or `?theme=light`

When generating a share link using the **Copy Link** button within the workspace, Python Code Lab will automatically append the current theme parameter matching your screen setting so that your preferences are preserved when sharing.

# Making Courses for Python Code Lab

This document outlines how to create interactive programming courses for **Python Code Lab** (`pythoncopy.html`).

Each level in a course consists of:

1. A **Python File (`.py`)**: Contains the starter code, automated test cases, navigation commands, and links.
2. A **Tutorial Page (`.html`)**: A responsive instruction page that is automatically previewed in the panel beside the editor.
3. **Assets (Images/GIFs)**: Displayed on the tutorial page to visualize the task.

---

## 1. Python File (`.py`) Structure & Special Commands

Python files use special comment annotations at the top or bottom of the file to configure the course runner.

### `#Next` (Link to next level)

Specifies the direct URL to the next level's raw python file. When the user passes all tests, a "Next Level" button appears leading to this URL.

* Format: `#Next <url>` or `#Next` followed by `# <url>` on the next line.
* Example:

  ```python
  #Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/beginners/taylor.py
  ```

### `#End` (Course completion)

Used on the **final level** of a course to mark the end. When all tests pass, the student is prompted to enter their name and claim a downloadable PDF/PNG certificate.

* Format: `#End <Course Title>` or `#End` followed by `# <Course Title>` on the next line.
* Example:

  ```python
  #End Python: Input, Variables and Output
  ```

### `#Input` and `#output` (Automated Tests)

Defines inputs and expected output checks for automated grading.

* **`#Input`**: Each comment line underneath represents a test case. Multiple inputs for the same test case are separated by commas.
* **`#output`**: Each comment line represents the expected substring(s) that the terminal output must contain for that test case (case-insensitive checks).
* Example:

  ```python
  #Input
  # 5, 3
  # 12, 8
  # 25, 15

  #output
  # 8
  # 20
  # 40
  ```

* **No Inputs**: If a test case does not require keyboard input, represent it with empty quotes `""`:

  ```python
  #Input
  # ""

  #output
  # 15
  ```

### Tutorial & Reference Links

Any standard web link in a comment line (except `#Next` lines) is extracted and listed in the **Reference Links** sidebar.
> [!IMPORTANT]
> The **first link** found in the file is **automatically loaded** inside the preview/instruction iframe on the side. Make sure to list your HTML tutorial link first!

* Example:

  ```python
  # Learn more: https://jamesabela.github.io/jsfun/beginners/hello.html
  ```

### Help Text / Ignored Comments

To prevent informational comments from being parsed as test cases, any comment line containing one of these words (case-insensitive) is ignored:

* `entered`, `seperator`, `separator`, `speech marks`, `between`, `expected`, `same format`, `how to`, `example`
* Example:

  ```python
  # String inputs should be entered without speech marks.
  ```

---

## 2. Tutorial Page (`.html`) Structure

The tutorial files are clean, responsive HTML documents loaded in the side iframe. They should match the styling of existing pages like [hello.html](file:///Users/abela.j/Documents/antigravcode/jsfun/beginners/hello.html).

### Recommended Template

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tutorial: Lesson Title</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500&family=Inter:wght@400;500;600;700&family=Outfit:wght@600;700;800&display=swap" rel="stylesheet">
  <style>
    :root {
      --bg-gradient: linear-gradient(135deg, #f8fafc, #eff6ff);
      --card-bg: #ffffff;
      --text-main: #1e293b;
      --text-muted: #64748b;
      --accent-gold: #d4af37;
      --accent-gold-glow: rgba(212, 175, 55, 0.15);
      --accent-dark: #0f172a;
      --accent-blue: #3b82f6;
      --accent-blue-glow: rgba(59, 130, 246, 0.1);
      --success: #10b981;
      --success-glow: rgba(16, 185, 129, 0.15);
      --border-color: rgba(226, 201, 116, 0.25);
      --shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05), 0 8px 10px -6px rgba(0, 0, 0, 0.05);
      --code-bg: #0f172a;
      --code-text: #f8fafc;
    }

    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }

    body {
      background: var(--bg-gradient);
      color: var(--text-main);
      font-family: 'Inter', system-ui, -apple-system, sans-serif;
      min-height: 100vh;
      padding: 24px;
      display: flex;
      justify-content: center;
      align-items: flex-start;
    }

    .container {
      width: 100%;
      max-width: 680px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      border-bottom: 2px solid var(--border-color);
      padding-bottom: 12px;
    }

    .title-group h1 {
      font-family: 'Outfit', sans-serif;
      font-weight: 800;
      font-size: 1.6rem;
      letter-spacing: -0.02em;
      background: linear-gradient(to right, var(--text-main), var(--accent-gold));
      -webkit-background-clip: text;
      background-clip: text;
      -webkit-text-fill-color: transparent;
      margin-bottom: 4px;
    }

    .title-group p {
      font-size: 0.9rem;
      color: var(--text-muted);
    }

    .card {
      background: var(--card-bg);
      border: 1px solid var(--border-color);
      border-radius: 16px;
      padding: 24px;
      box-shadow: var(--shadow);
      display: flex;
      flex-direction: column;
      gap: 16px;
    }

    .card-title {
      font-family: 'Outfit', sans-serif;
      font-size: 1.15rem;
      font-weight: 700;
      display: flex;
      align-items: center;
      gap: 8px;
      color: var(--accent-gold);
      text-transform: uppercase;
    }

    .instruction-text {
      font-size: 0.95rem;
      line-height: 1.5;
      color: var(--text-main);
    }

    .image-wrapper {
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 12px;
      overflow: hidden;
      border: 2px solid var(--border-color);
      box-shadow: var(--shadow);
      background: var(--card-bg);
      max-width: 100%;
    }

    .hero-img {
      max-width: 100%;
      height: auto;
      display: block;
      object-fit: contain;
    }

    .banner {
      background: var(--accent-gold-glow);
      border-left: 4px solid var(--accent-gold);
      padding: 12px 16px;
      border-radius: 8px;
      font-size: 0.9rem;
      line-height: 1.4;
      display: flex;
      align-items: center;
      gap: 10px;
    }

    pre {
      background: var(--code-bg);
      color: var(--code-text);
      padding: 14px;
      border-radius: 8px;
      font-family: 'Fira Code', Consolas, Monaco, monospace;
      font-size: 0.85rem;
      overflow-x: auto;
      border: 1px solid rgba(255, 255, 255, 0.05);
    }
  </style>
</head>
<body>
  <div class="container">
    <header>
      <div class="title-group">
        <p>LEVEL 1: CATEGORY</p>
        <h1>Lesson Title 👋</h1>
      </div>
    </header>

    <div class="card">
      <div class="card-title">💡 Intro</div>
      <p class="instruction-text">Explain the concept here...</p>
      <div class="image-wrapper">
        <img src="your_image.jpg" alt="Visual aid" class="hero-img">
      </div>
    </div>

    <div class="card">
      <div class="card-title">⚙️ Task</div>
      <p class="instruction-text">Detail the task here.</p>
      <pre># Example code snippet</pre>
    </div>
  </div>
</body>
</html>
```

---

## 3. Hosting & Deployment

1. Upload the files (e.g. to a GitHub repository).
2. Get the **raw URL** of the start level (e.g., from `raw.githubusercontent.com`).
3. Load the course in the browser by appending the raw URL as a query parameter:
   `https://jamesabela.github.io/jsfun/pythoncopy.html?url=<RAW_URL>`

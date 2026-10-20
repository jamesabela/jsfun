# AI Agent Guide: Adding Challenges to `challenges.json`

This guide provides instructions and specifications for AI coding assistants (and developers) to efficiently create, format, and validate programming challenges in `challenges.json`.

---

## 1. Architecture & Single Source of Truth

- **Database File:** [`challenges.json`](file:///Users/abela.j/Documents/antigravcode/jsfun/challenges.json) is the single source of truth for all coding challenges in this repository.
- **Consumer Pages:**
  - [`challenge_list.html`](file:///Users/abela.j/Documents/antigravcode/jsfun/challenge_list.html) (Searchable, filterable directory with launch links)
  - [`pythoncopy.html`](file:///Users/abela.j/Documents/antigravcode/jsfun/pythoncopy.html) (Python Code Lab IDE with daily challenge loader & test runner)
  - [`daily.html`](file:///Users/abela.j/Documents/antigravcode/jsfun/daily.html) & [`certificate.html`](file:///Users/abela.j/Documents/antigravcode/jsfun/certificate.html)
- **Safe Management Script:** [`manage_challenges.py`](file:///Users/abela.j/Documents/antigravcode/jsfun/manage_challenges.py) handles:
  - Automatic timestamped backups in `.resource_backups/`
  - Automated ID assignment (`max(id) + 1`)
  - Tag normalization
  - Schema validation

---

## 2. Challenge Schema

Every challenge in `challenges.json` is a JSON object with this exact shape:

```json
{
  "id": 127,
  "title": "Greatest Common Divisor",
  "spice": "🌶️🌶️",
  "comment": "# instructions: Ask the user to enter two positive integers and display their Greatest Common Divisor (GCD). A clever mathematical trick (due to Euclid) makes it easy to find greatest common divisors: suppose that a and b are two positive integers. If b = 0, then the answer is a; otherwise, gcd(a, b) is the same as gcd(b, a % b). Examples: gcd(2, 12) = 2, gcd(6, 12) = 6, gcd(9, 12) = 3, gcd(17, 12) = 1.\n#Input\n# 2, 12\n# 6, 12\n# 9, 12\n# 17, 12\n\n#output\n# 2\n# 6\n# 3\n# 1\n\n#End Greatest Common Divisor",
  "tags": [
    "maths",
    "functions",
    "Recursion",
    "repetition",
    "Self Marking"
  ],
  "helpUrl": "pythonmanual.html#recursion"
}
```

### Field Definitions

| Field | Type | Description | Rules & Constraints |
| :--- | :--- | :--- | :--- |
| `id` | `integer` | Unique sequential challenge identifier | Auto-incremented (`max(id) + 1`). Must be contiguous. |
| `title` | `string` | Human-readable title | Cleaned of leading decorative emojis or bullets. |
| `spice` | `string` | Difficulty indicator using chili emoji | `🌶️` (Mild), `🌶️🌶️` (Medium), or `🌶️🌶️🌶️` (Spicy). |
| `comment` | `string` | Challenge prompt and test cases | Must start with `# instructions: `. Follow the single-line rule below. |
| `tags` | `array[str]` | Categorization taxonomy | Must use canonical tags. Always include `"Self Marking"` if `#Input` is used. |
| `helpUrl` | `string` | Documentation anchor link | Points to a section in `pythonmanual.html` (e.g. `pythonmanual.html#recursion`). |

---

## 3. Formatting the `comment` Field

The `comment` string serves two purposes:
1. It is extracted by UI cards to show challenge descriptions.
2. It is loaded directly into the Python Code Lab editor as code/comment header.

### ⚠️ The Single-Line Instruction Rule (Critical)
Both `pythoncopy.js` and `challenge_list.html` extract the challenge description using:
```javascript
comment.split(/\n#\s*(?:input|output|end)\b/i)[0]
       .replace(/^#\s*instructions:\s*/i, '')
       .trim();
```
**Rule:** The entire instruction text before `#Input` must be on a **single line** starting with `# instructions: `. Do not break the instruction text across multiple `#` comment lines before `#Input`, or raw `#` markers will leak into the UI cards.

### Self-Marking Syntax (`#Input` and `#output`)
For automated grading in Python Code Lab:

```text
# instructions: Ask the user for two numbers and print their sum.
#Input
# 3, 5
# 10, 20

#output
# 8
# 30

#End Sum Two Numbers
```

- **`#Input` lines:** Comma-separated strings corresponding to successive `input()` calls in Python.
- **`#output` lines:** Expected substring values that must appear in `stdout`.
- **`#End <Title>`:** Delimiter indicating the end of the challenge metadata.

### Designing Robust Test Cases
The test runner checks if expected strings appear in `stdout` (case-insensitive substring match). Keep in mind:
1. **Input Echo:** Console input prompts and user inputs are captured in `stdout`. If an input is `2, 12` and the expected output is `2`, `"2"` already appears in `stdout`.
2. **Prevent False Positives:** Always include at least one test case where the expected answer is **not** present in the input values (e.g., `gcd(9, 12) = 3` or `3 + 5 = 8`).
3. **Quantity:** 2 to 4 diverse test trials provide fast, reliable grading.

---

## 4. Canonical Tag Taxonomy

Always use the canonical casing and naming defined in [`manage_challenges.py`](file:///Users/abela.j/Documents/antigravcode/jsfun/manage_challenges.py):

### Programming Concepts (Lowercase)
- `selection` (conditions, ifs)
- `repetition` (loops, for, while, iteration)
- `array` (lists, arrays)
- `strings` (string handling, text)
- `counting` (counter variables)
- `totalling` (accumulators, sum totals)
- `maths` (arithmetic, modulo, calculations)
- `functions` (procedures, functions, subroutines)
- `cryptography` (ciphers, encryption)
- `file-handling` (reading, writing files)
- `object-oriented` (classes, OOP)
- `pseudocode` (Cambridge 9618 pseudocode)
- `random` (randomization, simulations)
- `creative` (open-ended projects)

### Special Categories (Title Case)
- `Self Marking` (mandatory if `#Input` / `#output` are provided)
- `Recursion` (recursive algorithms)
- `Turtle` (turtle graphics)
- `2D Arrays` (nested lists, grids)
- `Student Created` (community/student submissions)
- `Halloween` (themed seasonal challenges)

---

## 5. Help URL Anchors (`pythonmanual.html`)

Map the challenge to the most relevant section of the Python Manual:

- `pythonmanual.html#selection`
- `pythonmanual.html#for-loops`
- `pythonmanual.html#while-loops`
- `pythonmanual.html#lists`
- `pythonmanual.html#2d-lists`
- `pythonmanual.html#functions`
- `pythonmanual.html#recursion`
- `pythonmanual.html#operators`
- `pythonmanual.html#string-length`
- `pythonmanual.html#random-statistics`
- `pythonmanual.html#turtle`
- `pythonmanual.html#files`
- `pythonmanual.html#oop`
- `pythonmanual.html#searching`
- `pythonmanual.html#bubble-sort`
- `pythonmanual.html#insertion-sort`
- `pythonmanual.html#validation`

---

## 6. Standard AI Workflow for Adding Challenges

When asked to add a new challenge, follow these steps in order:

### Step 1: Check for Duplicates
Search `challenges.json` for similar titles or keywords to ensure the challenge is unique:
```bash
python3 manage_challenges.py list --tag <tag>
```

### Step 2: Prepare the Challenge Object
Determine:
1. `id`: Next ID from `max(id) + 1`
2. `title`: Clean name without leading emojis
3. `spice`: `🌶️`, `🌶️🌶️`, or `🌶️🌶️🌶️`
4. `comment`: Single-line `# instructions: ...` with `#Input`, `#output`, `#End ...`
5. `tags`: Canonical tags including `"Self Marking"`
6. `helpUrl`: Valid anchor in `pythonmanual.html`

### Step 3: Insert Using `manage_challenges.py`
Use a small Python script to leverage `save_challenges()` (which automatically creates timestamped backups in `.resource_backups/` and verifies write integrity):

```python
import sys, os, json
import manage_challenges

challenges = manage_challenges.load_challenges()
next_id = max((c.get("id", 0) for c in challenges), default=0) + 1

new_challenge = {
    "id": next_id,
    "title": "Your Challenge Title",
    "spice": "🌶️🌶️",
    "comment": "# instructions: ...\n#Input\n# 1, 2\n\n#output\n# 3\n\n#End Your Challenge Title",
    "tags": ["maths", "Self Marking"],
    "helpUrl": "pythonmanual.html#operators"
}

challenges.append(new_challenge)
manage_challenges.save_challenges(challenges)
```

### Step 4: Validate
Always run the validation suite:
```bash
python3 manage_challenges.py validate
```
Ensure output reports: `✅ Zero schema errors found!`

### Step 5: Verify Database Stats & Diff
Check that the count and tags updated as expected:
```bash
python3 manage_challenges.py stats
git diff challenges.json
```

---

## 7. Common Pitfalls to Avoid

| Pitfall | Problem | Correct Action |
| :--- | :--- | :--- |
| **Multi-line instruction comments** | `#` markers show up inside UI challenge cards | Keep instructions on a single line starting with `# instructions: ` |
| **Using synonyms for tags** | `loops`, `lists`, `oop` cause fragmented filtering | Use normalized canonical tags: `repetition`, `array`, `object-oriented` |
| **Omitting `"Self Marking"`** | Tests will not show up under self-marking filter | Include `"Self Marking"` tag whenever `#Input` / `#output` exist |
| **Hardcoding IDs** | May conflict if challenges were added concurrently | Always calculate dynamically: `max(id) + 1` |
| **Direct JSON overwrites without backup** | Accidental data corruption | Always use `manage_challenges.save_challenges()` |

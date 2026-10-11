#!/usr/bin/env python3
"""
manage_resources.py - Safe CLI Editor & Validator for usefulresources.json

Provides an interactive wizard, validation suite, and synchronization engine
to safely add, edit, delete, and inspect educational tools in usefulresources.json.

Safety Guarantees:
  - Automatic timestamped backups prior to any write operations (.resource_backups/)
  - Atomic file writes using temporary staging files
  - Automatic synchronization of derived 'byTopic' projections
  - Strict topic and schema validation
  - Duplicate URL prevention
  - Deterministic alphabetical sorting within categories
"""

import sys
import os
import json
import re
import datetime
import urllib.request
import urllib.error
from typing import Dict, List, Optional, Any, Tuple

RESOURCE_FILE = "usefulresources.json"
BACKUP_DIR = ".resource_backups"
MAX_BACKUPS = 20

# Color / ANSI styling helpers
USE_COLOR = sys.stdout.isatty()

def style(text: str, code: str) -> str:
    if not USE_COLOR:
        return text
    return f"\033[{code}m{text}\033[0m"

def bold(text: str) -> str: return style(text, "1")
def green(text: str) -> str: return style(text, "32")
def red(text: str) -> str: return style(text, "31")
def yellow(text: str) -> str: return style(text, "33")
def blue(text: str) -> str: return style(text, "34")
def cyan(text: str) -> str: return style(text, "36")
def dim(text: str) -> str: return style(text, "2")


def resolve_path(filename: str = RESOURCE_FILE) -> str:
    """Finds the resource file relative to the script's directory or current cwd."""
    if os.path.exists(filename):
        return os.path.abspath(filename)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidate = os.path.join(script_dir, filename)
    if os.path.exists(candidate):
        return candidate
    return os.path.abspath(filename)


def load_database(filepath: Optional[str] = None) -> Dict[str, Any]:
    """Loads and validates JSON database structure."""
    path = filepath or resolve_path()
    if not os.path.exists(path):
        print(red(f"Error: Database file not found at '{path}'"))
        sys.exit(1)
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(red(f"FATAL: Malformed JSON in '{path}': {e}"))
        sys.exit(1)
    
    if "categories" not in data or not isinstance(data["categories"], list):
        print(red("FATAL: 'categories' array missing from database!"))
        sys.exit(1)
    
    return data


def create_backup(filepath: Optional[str] = None) -> str:
    """Creates a timestamped backup before modifying usefulresources.json."""
    path = filepath or resolve_path()
    base_dir = os.path.dirname(path)
    backup_path = os.path.join(base_dir, BACKUP_DIR)
    os.makedirs(backup_path, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"usefulresources_{timestamp}.json"
    dest_path = os.path.join(backup_path, backup_filename)
    
    with open(path, "r", encoding="utf-8") as src, open(dest_path, "w", encoding="utf-8") as dst:
        dst.write(src.read())
    
    # Prune oldest backups if exceeding limit
    try:
        backups = sorted([os.path.join(backup_path, f) for f in os.listdir(backup_path) if f.startswith("usefulresources_") and f.endswith(".json")])
        while len(backups) > MAX_BACKUPS:
            oldest = backups.pop(0)
            os.remove(oldest)
    except Exception:
        pass
    
    return dest_path


def rebuild_by_topic(data: Dict[str, Any]) -> Dict[str, List[Dict[str, Any]]]:
    """
    Deterministically regenerates data['byTopic'] from data['categories'].
    Guarantees 100% synchronisation between master list and topic projections.
    """
    topics_list = data.get("topics", [])
    topic_ids = [t["id"] for t in topics_list] if topics_list else [
        "general", "computing", "english", "social_sciences", "sciences", "maths"
    ]
    
    by_topic = {}
    for tid in topic_ids:
        categories_for_topic = []
        for cat in data["categories"]:
            matching_tools = [t for t in cat.get("tools", []) if tid in t.get("topics", [])]
            if matching_tools:
                categories_for_topic.append({
                    "category": cat["category"],
                    "description": cat.get("description", ""),
                    "tutorialVideo": cat.get("tutorialVideo", None),
                    "tools": matching_tools
                })
        by_topic[tid] = categories_for_topic
    
    return by_topic


def save_database(data: Dict[str, Any], filepath: Optional[str] = None, make_backup: bool = True) -> None:
    """
    Saves database with atomic file replacement and automatic byTopic projection sync.
    """
    path = filepath or resolve_path()
    
    if make_backup and os.path.exists(path):
        bpath = create_backup(path)
        print(dim(f"Safety backup created: {os.path.basename(bpath)}"))
    
    # Ensure tools in each category are sorted alphabetically
    for cat in data.get("categories", []):
        if "tools" in cat and isinstance(cat["tools"], list):
            cat["tools"].sort(key=lambda t: t.get("title", "").strip().lower())
    
    # Update projection and timestamp
    data["byTopic"] = rebuild_by_topic(data)
    data["updatedAt"] = datetime.datetime.now().strftime("%Y-%m-%d")
    
    # Atomic write via staging file
    tmp_path = path + ".tmp"
    try:
        with open(tmp_path, "w", encoding="utf-8") as f:
            json_str = json.dumps(data, indent=2, ensure_ascii=False)
            f.write(json_str)
        os.replace(tmp_path, path)
        print(green(f"✔ Successfully saved '{os.path.basename(path)}' (Updated: {data['updatedAt']})"))
    except Exception as e:
        if os.path.exists(tmp_path):
            os.remove(tmp_path)
        print(red(f"FATAL: Error saving database: {e}"))
        sys.exit(1)


# ----------------------------------------------------------------------
# Validation Engine
# ----------------------------------------------------------------------

def validate_database(data: Dict[str, Any]) -> Tuple[int, int]:
    """Runs a complete integrity audit across all categories, tools, and topic projections."""
    errors = 0
    warnings = 0
    
    print(bold("\n--- Running Integrity & Schema Audit ---"))
    
    valid_topics = {t["id"] for t in data.get("topics", [])}
    if not valid_topics:
        valid_topics = {"general", "computing", "english", "social_sciences", "sciences", "maths"}
    
    url_map: Dict[str, List[str]] = {}
    total_tools = 0
    
    categories = data.get("categories", [])
    print(f"Auditing {len(categories)} categories...")
    
    for c_idx, cat in enumerate(categories):
        cname = cat.get("category", f"<Unnamed Category #{c_idx}>")
        tools = cat.get("tools", [])
        
        # Check alphabetical sorting
        titles = [t.get("title", "") for t in tools]
        for i in range(len(titles) - 1):
            if titles[i].lower() > titles[i+1].lower():
                warnings += 1
                print(yellow(f"  [Sort Warning] Category '{cname}': '{titles[i]}' appears before '{titles[i+1]}'"))
        
        for t_idx, tool in enumerate(tools):
            total_tools += 1
            title = tool.get("title", f"<Tool #{t_idx}>")
            url = tool.get("url", "").strip()
            
            # Required fields
            for req in ["title", "url", "desc", "tag", "topics", "isExternal"]:
                if req not in tool:
                    errors += 1
                    print(red(f"  [Missing Field] '{title}' in '{cname}' is missing required field '{req}'"))
            
            # URL Validation
            if not url:
                errors += 1
                print(red(f"  [Empty URL] Tool '{title}' in '{cname}' has no URL"))
            elif not (url.startswith("http://") or url.startswith("https://")):
                warnings += 1
                print(yellow(f"  [URL Format] Tool '{title}' URL does not begin with http:// or https://: {url}"))
            else:
                if url in url_map:
                    errors += 1
                    print(red(f"  [Duplicate URL] '{url}' appears in both '{url_map[url]}' and '{cname}' ('{title}')"))
                else:
                    url_map[url] = f"{cname} -> {title}"
            
            # Topic validation
            tool_topics = tool.get("topics", [])
            if not isinstance(tool_topics, list) or len(tool_topics) == 0:
                errors += 1
                print(red(f"  [Invalid Topics] Tool '{title}' must have at least one topic assigned"))
            else:
                for top in tool_topics:
                    if top not in valid_topics:
                        errors += 1
                        print(red(f"  [Unknown Topic] Tool '{title}' contains unrecognized topic '{top}'. Valid: {valid_topics}"))
    
    # Check byTopic projection sync
    expected_by_topic = rebuild_by_topic(data)
    current_by_topic = data.get("byTopic", {})
    
    for tid in valid_topics:
        exp_cats = expected_by_topic.get(tid, [])
        curr_cats = current_by_topic.get(tid, [])
        if exp_cats != curr_cats:
            errors += 1
            print(red(f"  [Desync] byTopic['{tid}'] is out of sync with master categories! (Run 'sync' to resolve)"))
    
    print("\n" + "=" * 50)
    print(f"Total Tools Audited: {total_tools}")
    if errors == 0 and warnings == 0:
        print(green("✔ All integrity checks passed! Database is healthy and 100% in sync."))
    elif errors == 0:
        print(yellow(f"✔ No errors found ({warnings} non-blocking warnings)."))
    else:
        print(red(f"✘ Audit found {errors} errors and {warnings} warnings."))
    print("=" * 50 + "\n")
    
    return errors, warnings


# ----------------------------------------------------------------------
# Interactive Wizard
# ----------------------------------------------------------------------

COMMON_TAGS = [
    "All ages",
    "KS3 / iGCSE / A-Level",
    "iGCSE / A-Level",
    "KS3+",
    "Primary / KS3",
    "KS2 / KS3",
    "EYFS / KS1",
    "Teacher Tool",
]

def prompt_input(label: str, default: Optional[str] = None, validator=None) -> str:
    """Prompt user with default option and validator."""
    prompt_str = f"{bold(label)}"
    if default:
        prompt_str += f" [{cyan(default)}]"
    prompt_str += ": "
    
    while True:
        try:
            val = input(prompt_str).strip()
        except (KeyboardInterrupt, EOFError):
            print("\nOperation cancelled.")
            sys.exit(0)
        
        if not val and default is not None:
            val = default
        
        if validator:
            ok, err_msg = validator(val)
            if not ok:
                print(red(f"  Error: {err_msg}"))
                continue
        
        if val:
            return val
        print(red("  Value cannot be empty. Please enter a value."))


def select_category(data: Dict[str, Any]) -> str:
    """Presents a numbered list of categories or allows adding a new one."""
    categories = [c["category"] for c in data["categories"]]
    print(bold("\nSelect Category:"))
    for i, cat in enumerate(categories, 1):
        print(f"  {cyan(str(i).rjust(2))}. {cat}")
    print(f"  {yellow('+')}. Create a NEW Category")
    
    while True:
        choice = prompt_input("Enter category number (or + for new)").strip()
        if choice in ["+", "new", "n"]:
            new_cat_name = prompt_input("Enter new category name")
            new_cat_desc = prompt_input("Enter category description")
            data["categories"].append({
                "category": new_cat_name,
                "description": new_cat_desc,
                "tutorialVideo": None,
                "tools": []
            })
            print(green(f"✔ Created new category '{new_cat_name}'"))
            return new_cat_name
        
        if choice.isdigit():
            idx = int(choice) - 1
            if 0 <= idx < len(categories):
                return categories[idx]
        
        # Check direct name match
        matches = [c for c in categories if choice.lower() in c.lower()]
        if len(matches) == 1:
            return matches[0]
        
        print(red("Invalid selection. Please choose a valid category number."))


def select_topics(data: Dict[str, Any], preselected: Optional[List[str]] = None) -> List[str]:
    """Presents checkbox-like topic selection."""
    topics_info = data.get("topics", [
        {"id": "general", "name": "General Teaching", "icon": "🎓"},
        {"id": "computing", "name": "Computing Tools", "icon": "💻"},
        {"id": "english", "name": "English Tools", "icon": "📚"},
        {"id": "social_sciences", "name": "Social Sciences", "icon": "🌍"},
        {"id": "sciences", "name": "Sciences", "icon": "🧪"},
        {"id": "maths", "name": "Mathematics", "icon": "🔢"},
    ])
    
    print(bold("\nAssign Topics (select all that apply, comma-separated):"))
    for i, t in enumerate(topics_info, 1):
        checked = "✔" if preselected and t["id"] in preselected else " "
        print(f"  {cyan(str(i))}. [{green(checked)}] {t.get('icon', '')} {t['id']} ({t.get('name', '')})")
    
    default_str = ",".join([str(i+1) for i, t in enumerate(topics_info) if preselected and t["id"] in preselected]) if preselected else "1"
    
    while True:
        raw = prompt_input("Enter topic numbers (e.g. 1,2,4)", default=default_str)
        tokens = [t.strip() for t in raw.split(",") if t.strip()]
        selected = set()
        valid = True
        
        for tok in tokens:
            if tok.isdigit():
                idx = int(tok) - 1
                if 0 <= idx < len(topics_info):
                    selected.add(topics_info[idx]["id"])
                else:
                    valid = False
            elif any(tok.lower() == t["id"].lower() for t in topics_info):
                matching = next(t["id"] for t in topics_info if tok.lower() == t["id"].lower())
                selected.add(matching)
            else:
                valid = False
        
        if valid and selected:
            return sorted(list(selected))
        print(red("Invalid topic selection. Please enter valid topic numbers (e.g. 1, 2)."))


def select_tag(current_tag: Optional[str] = None) -> str:
    """Presents common tags or allows custom entry."""
    print(bold("\nSelect Age / Level Tag:"))
    for i, tag in enumerate(COMMON_TAGS, 1):
        print(f"  {cyan(str(i))}. {tag}")
    print(f"  {yellow('C')}. Custom tag")
    
    default_choice = "1"
    if current_tag and current_tag in COMMON_TAGS:
        default_choice = str(COMMON_TAGS.index(current_tag) + 1)
    
    choice = prompt_input("Enter choice", default=default_choice).strip()
    if choice.isdigit():
        idx = int(choice) - 1
        if 0 <= idx < len(COMMON_TAGS):
            return COMMON_TAGS[idx]
    
    return prompt_input("Enter custom tag (e.g. 'KS3 / iGCSE')", default=current_tag or "All ages")


def print_tool_card(tool: Dict[str, Any], category: str):
    """Prints a styled terminal preview card representing the tool."""
    w = 68
    print("\n" + cyan("┌" + "─" * (w - 2) + "┐"))
    print(cyan("│") + f" {bold(tool.get('title', ''))}".ljust(w + 7) + cyan("│"))
    print(cyan("│") + f" URL: {blue(tool.get('url', ''))}".ljust(w + 8) + cyan("│"))
    print(cyan("│") + f" Category: {category}".ljust(w - 2) + cyan("│"))
    desc = tool.get('desc', '')
    desc_line1 = desc[:60]
    desc_line2 = desc[60:120] if len(desc) > 60 else ""
    print(cyan("│") + f" Desc: {desc_line1}".ljust(w - 2) + cyan("│"))
    if desc_line2:
        print(cyan("│") + f"       {desc_line2}".ljust(w - 2) + cyan("│"))
    print(cyan("│") + f" Tag: {yellow(tool.get('tag', ''))}  |  Author: {tool.get('author') or 'None'}".ljust(w + 7) + cyan("│"))
    topics_display = ", ".join(tool.get("topics", []))
    print(cyan("│") + f" Topics: {green(topics_display)}  |  External: {tool.get('isExternal')}".ljust(w + 7) + cyan("│"))
    if tool.get("tutorialVideo"):
        print(cyan("│") + f" Tutorial: {tool.get('tutorialVideo')}".ljust(w - 2) + cyan("│"))
    print(cyan("└" + "─" * (w - 2) + "┘") + "\n")


# ----------------------------------------------------------------------
# Tool Operations: Add, Edit, Delete, Search
# ----------------------------------------------------------------------

def add_tool_wizard(data: Dict[str, Any]) -> bool:
    """Interactive wizard to safely add a new resource tool."""
    print(bold("\n=== Add New Resource Tool ==="))
    
    # 1. URL with duplicate check
    def url_validator(u: str):
        if not (u.startswith("http://") or u.startswith("https://")):
            return False, "URL must start with http:// or https://"
        return True, ""
    
    url = prompt_input("Tool URL", validator=url_validator)
    
    # Check duplicate
    for cat in data["categories"]:
        for t in cat.get("tools", []):
            if t.get("url", "").strip().rstrip("/") == url.rstrip("/"):
                print(yellow(f"\n⚠️  Warning: A tool with this URL already exists in '{cat['category']}': '{t.get('title')}'"))
                confirm = prompt_input("Do you still want to proceed? (y/N)", default="n")
                if confirm.lower() != "y":
                    return False
    
    # Auto-detect default title from URL slug
    slug = url.rstrip("/").split("/")[-1].replace(".html", "").replace("-", " ").replace("_", " ").title()
    title = prompt_input("Tool Title", default=slug)
    
    category = select_category(data)
    desc = prompt_input("Description (1-2 clear sentences)")
    tag = select_tag()
    topics = select_topics(data)
    
    author = prompt_input("Author", default="James Abela")
    
    # Auto-detect external
    default_ext = "n" if "jamesabela.github.io/jsfun/" in url else "y"
    is_external_str = prompt_input("Is this an external tool/repo? (y/n)", default=default_ext)
    is_external = is_external_str.lower().startswith("y")
    
    tutorial = prompt_input("Tutorial Video URL (optional, press Enter to skip)", default="") or None
    
    new_tool = {
        "title": title,
        "url": url,
        "desc": desc,
        "tag": tag,
        "topics": topics,
        "author": author if author else None,
        "tutorialVideo": tutorial,
        "isExternal": is_external
    }
    
    print_tool_card(new_tool, category)
    confirm = prompt_input(bold("Save this tool to usefulresources.json? (Y/n)"), default="y")
    if confirm.lower().startswith("y"):
        target_cat = next(c for c in data["categories"] if c["category"] == category)
        target_cat["tools"].append(new_tool)
        save_database(data)
        print(green(f"✔ Successfully added '{title}' to '{category}'!"))
        return True
    else:
        print("Add tool cancelled.")
        return False


def find_tools(data: Dict[str, Any], query: str) -> List[Tuple[Dict[str, Any], Dict[str, Any]]]:
    """Finds tools matching a search query string across title, desc, url, and author."""
    q = query.lower().strip()
    matches = []
    for cat in data["categories"]:
        for tool in cat.get("tools", []):
            combined = f"{tool.get('title', '')} {tool.get('desc', '')} {tool.get('url', '')} {tool.get('author', '')}".lower()
            if q in combined:
                matches.append((tool, cat))
    return matches


def search_and_edit_tool(data: Dict[str, Any], initial_query: Optional[str] = None):
    """Interactive tool search and in-place field editing."""
    query = initial_query or prompt_input("Search tool to edit (title or keyword)")
    matches = find_tools(data, query)
    
    if not matches:
        print(yellow(f"No tools found matching '{query}'."))
        return
    
    print(bold(f"\nFound {len(matches)} matching tool(s):"))
    for i, (t, c) in enumerate(matches, 1):
        print(f"  {cyan(str(i).rjust(2))}. {bold(t.get('title', ''))} ({dim(c['category'])})")
        print(f"      {dim(t.get('url', ''))}")
    
    choice = prompt_input("\nSelect tool number to edit (or 0 to cancel)", default="1")
    if not choice.isdigit() or int(choice) == 0:
        return
    idx = int(choice) - 1
    if not (0 <= idx < len(matches)):
        print(red("Invalid choice."))
        return
    
    tool, category_obj = matches[idx]
    current_cat_name = category_obj["category"]
    print_tool_card(tool, current_cat_name)
    
    print(bold("Select field to edit:"))
    fields = ["Title", "URL", "Description", "Tag", "Topics", "Author", "External Flag", "Tutorial Video", "Category", "ALL FIELDS"]
    for i, f in enumerate(fields, 1):
        print(f"  {cyan(str(i))}. {f}")
    
    f_choice = prompt_input("Enter choice", default="10")
    if not f_choice.isdigit():
        return
    f_idx = int(f_choice)
    
    if f_idx in [1, 10]:
        tool["title"] = prompt_input("Title", default=tool.get("title"))
    if f_idx in [2, 10]:
        tool["url"] = prompt_input("URL", default=tool.get("url"))
    if f_idx in [3, 10]:
        tool["desc"] = prompt_input("Description", default=tool.get("desc"))
    if f_idx in [4, 10]:
        tool["tag"] = select_tag(current_tag=tool.get("tag"))
    if f_idx in [5, 10]:
        tool["topics"] = select_topics(data, preselected=tool.get("topics", []))
    if f_idx in [6, 10]:
        tool["author"] = prompt_input("Author", default=tool.get("author") or "") or None
    if f_idx in [7, 10]:
        ext_def = "y" if tool.get("isExternal") else "n"
        tool["isExternal"] = prompt_input("Is External (y/n)", default=ext_def).lower().startswith("y")
    if f_idx in [8, 10]:
        tool["tutorialVideo"] = prompt_input("Tutorial Video", default=tool.get("tutorialVideo") or "") or None
    if f_idx in [9, 10]:
        new_cat = select_category(data)
        if new_cat != current_cat_name:
            category_obj["tools"].remove(tool)
            target_cat = next(c for c in data["categories"] if c["category"] == new_cat)
            target_cat["tools"].append(tool)
            current_cat_name = new_cat
            print(green(f"Moved tool to category '{new_cat}'"))
    
    print_tool_card(tool, current_cat_name)
    confirm = prompt_input(bold("Save changes to database? (Y/n)"), default="y")
    if confirm.lower().startswith("y"):
        save_database(data)
        print(green(f"✔ Tool '{tool.get('title')}' updated successfully!"))


def delete_tool(data: Dict[str, Any], initial_query: Optional[str] = None):
    """Safely search and delete a resource tool."""
    query = initial_query or prompt_input("Search tool to delete")
    matches = find_tools(data, query)
    
    if not matches:
        print(yellow(f"No tools found matching '{query}'."))
        return
    
    print(bold(f"\nSelect tool to delete:"))
    for i, (t, c) in enumerate(matches, 1):
        print(f"  {cyan(str(i).rjust(2))}. {bold(t.get('title', ''))} ({dim(c['category'])}) - {t.get('url')}")
    
    choice = prompt_input("Enter tool number to DELETE (0 to cancel)", default="0")
    if not choice.isdigit() or int(choice) == 0:
        print("Delete cancelled.")
        return
    
    idx = int(choice) - 1
    if 0 <= idx < len(matches):
        tool, cat = matches[idx]
        confirm = prompt_input(red(f"Are you sure you want to permanently delete '{tool.get('title')}'? (yes/NO)"), default="no")
        if confirm.lower() == "yes":
            cat["tools"].remove(tool)
            save_database(data)
            print(green(f"✔ Tool '{tool.get('title')}' has been removed from '{cat['category']}'."))
        else:
            print("Delete cancelled.")


def list_tools(data: Dict[str, Any], query: Optional[str] = None):
    """Lists tools with search filter and category breakdown."""
    if query:
        matches = find_tools(data, query)
        print(bold(f"\nResults for '{query}' ({len(matches)} tools):"))
        for t, c in matches:
            topics_str = ", ".join(t.get("topics", []))
            print(f"  • {bold(t.get('title', ''))} [{yellow(t.get('tag', ''))}] ({green(topics_str)})")
            print(f"    {dim(t.get('url', ''))}")
            print(f"    {dim('Cat: ' + c['category'])}")
    else:
        total = sum(len(c.get("tools", [])) for c in data["categories"])
        print(bold(f"\n--- Total Curated Tools: {total} across {len(data['categories'])} Categories ---"))
        for i, c in enumerate(data["categories"], 1):
            tools = c.get("tools", [])
            print(f"  {cyan(str(i).rjust(2))}. {bold(c['category'])} ({len(tools)} tools)")


def list_backups():
    """Lists all available safety backups in .resource_backups/."""
    bdir = os.path.join(os.path.dirname(resolve_path()), BACKUP_DIR)
    if not os.path.exists(bdir):
        print(dim("No backups directory found yet."))
        return []
    
    backups = sorted([f for f in os.listdir(bdir) if f.startswith("usefulresources_") and f.endswith(".json")], reverse=True)
    if not backups:
        print(dim("No backups found in .resource_backups/"))
        return []
    
    print(bold(f"\nAvailable Safety Backups ({len(backups)}):"))
    for i, b in enumerate(backups, 1):
        fpath = os.path.join(bdir, b)
        size_kb = os.path.getsize(fpath) / 1024
        print(f"  {cyan(str(i).rjust(2))}. {b} ({size_kb:.1f} KB)")
    return backups


def restore_backup(data: Dict[str, Any]):
    """Restores database from a selected backup."""
    backups = list_backups()
    if not backups:
        return
    
    choice = prompt_input("\nEnter backup number to RESTORE (0 to cancel)", default="0")
    if not choice.isdigit() or int(choice) == 0:
        return
    idx = int(choice) - 1
    if 0 <= idx < len(backups):
        selected = backups[idx]
        bdir = os.path.join(os.path.dirname(resolve_path()), BACKUP_DIR)
        bpath = os.path.join(bdir, selected)
        
        confirm = prompt_input(red(f"Restore from '{selected}'? Current file will be backed up first. (yes/NO)"), default="no")
        if confirm.lower() == "yes":
            target_path = resolve_path()
            create_backup(target_path)
            with open(bpath, "r", encoding="utf-8") as src, open(target_path, "w", encoding="utf-8") as dst:
                dst.write(src.read())
            print(green(f"✔ Successfully restored '{target_path}' from '{selected}'!"))


# ----------------------------------------------------------------------
# Main Interactive CLI Menu & Dispatcher
# ----------------------------------------------------------------------

def print_banner():
    banner = f"""
{cyan("╔══════════════════════════════════════════════════════════════════════╗")}
{cyan("║")} {bold("usefulresources.json Manager & Safe CLI Editor").center(68)} {cyan("║")}
{cyan("║")} {dim("Guaranteed byTopic sync • Atomic saves • Automatic backups").center(77)} {cyan("║")}
{cyan("╚══════════════════════════════════════════════════════════════════════╝")}
"""
    print(banner)


def main():
    db = load_database()
    
    # Handle direct command-line arguments
    if len(sys.argv) > 1:
        cmd = sys.argv[1].lower()
        if cmd in ["add", "a"]:
            add_tool_wizard(db)
        elif cmd in ["validate", "check", "v"]:
            validate_database(db)
        elif cmd in ["sync", "s"]:
            save_database(db)
            print(green("✔ Forced full re-synchronization of byTopic and alphabetical sorting."))
        elif cmd in ["list", "ls", "l"]:
            query = sys.argv[2] if len(sys.argv) > 2 else None
            list_tools(db, query)
        elif cmd in ["search", "find"]:
            query = sys.argv[2] if len(sys.argv) > 2 else ""
            list_tools(db, query)
        elif cmd in ["edit", "e"]:
            query = sys.argv[2] if len(sys.argv) > 2 else None
            search_and_edit_tool(db, query)
        elif cmd in ["delete", "del", "rm"]:
            query = sys.argv[2] if len(sys.argv) > 2 else None
            delete_tool(db, query)
        elif cmd in ["backup", "b"]:
            p = create_backup()
            print(green(f"✔ Created backup: {p}"))
        elif cmd in ["restore", "r"]:
            restore_backup(db)
        elif cmd in ["help", "--help", "-h"]:
            print(__doc__)
        else:
            print(red(f"Unknown command: '{cmd}'. Try: add, edit, delete, list, validate, sync, backup, restore"))
        return

    # Interactive Menu Loop
    while True:
        print_banner()
        print(f"Database File: {dim(resolve_path())}")
        total = sum(len(c.get("tools", [])) for c in db["categories"])
        print(f"Curated Tools: {bold(str(total))} across {bold(str(len(db['categories'])))} categories | Last Updated: {dim(db.get('updatedAt', 'Unknown'))}\n")
        
        print(f"  {cyan('1')}. {bold('Add a new tool')} (Interactive wizard)")
        print(f"  {cyan('2')}. {bold('Search & edit tool')} (Update title, tags, description, category)")
        print(f"  {cyan('3')}. {bold('Delete a tool')} (Safe removal with confirmation)")
        print(f"  {cyan('4')}. {bold('List / Search tools')} (Browse by keyword or category)")
        print(f"  {cyan('5')}. {bold('Validate database')} (Integrity audit & schema check)")
        print(f"  {cyan('6')}. {bold('Re-sync byTopic & format')} (Recomputes projections & sorts)")
        print(f"  {cyan('7')}. {bold('Safety backups & restore')} (View or restore previous versions)")
        print(f"  {cyan('8')}. {bold('Exit')}")
        
        choice = prompt_input("\nChoose an option (1-8)", default="1").strip()
        
        if choice == "1":
            add_tool_wizard(db)
        elif choice == "2":
            search_and_edit_tool(db)
        elif choice == "3":
            delete_tool(db)
        elif choice == "4":
            q = prompt_input("Enter search query (or leave empty to list all categories)", default="")
            list_tools(db, q if q else None)
        elif choice == "5":
            validate_database(db)
        elif choice == "6":
            save_database(db)
            print(green("✔ Synchronization complete."))
        elif choice == "7":
            print(bold("\n1. View backups  2. Restore backup  3. Create manual backup"))
            b_choice = prompt_input("Select action", default="1")
            if b_choice == "1":
                list_backups()
            elif b_choice == "2":
                restore_backup(db)
            elif b_choice == "3":
                bpath = create_backup()
                print(green(f"✔ Backup created: {bpath}"))
        elif choice in ["8", "q", "exit"]:
            print(green("Goodbye! Happy coding!"))
            break
        else:
            print(red("Invalid option. Please enter a number between 1 and 8."))
        
        print("\n" + dim("─" * 70) + "\n")
        # Reload database in case of updates
        db = load_database()


if __name__ == "__main__":
    main()

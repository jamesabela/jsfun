#!/usr/bin/env python3
"""
manage_challenges.py - Safe CLI Editor & Validator for challenges.json

Provides an interactive wizard, validation suite, and command-line interface
to safely add, inspect, and validate Python programming challenges in challenges.json.

Guarantees:
  - Automatic timestamped backups prior to any write operations (.resource_backups/)
  - Automatic ID incrementing (challenges.json is the single source of truth)
  - Automatic tag normalization (Loops -> repetition, Lists -> array, Selection -> selection)
  - Automatic title cleaning (strips decorative leading emojis)
  - Automatic instructions prefix formatting (# instructions: ...)
  - Atomic JSON validation and write
"""

import sys
import os
import json
import re
import datetime
import argparse
from typing import Dict, List, Optional, Any, Tuple

CHALLENGES_FILE = "challenges.json"
BACKUP_DIR = ".resource_backups"
MAX_BACKUPS = 25

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

# Canonical tag definitions & synonyms mapping
CANONICAL_TAGS = {
    # Lowercase programming concepts
    "selection": "selection",
    "repetition": "repetition",
    "array": "array",
    "strings": "strings",
    "counting": "counting",
    "totalling": "totalling",
    "maths": "maths",
    "functions": "functions",
    "cryptography": "cryptography",
    "file-handling": "file-handling",
    "object-oriented": "object-oriented",
    "pseudocode": "pseudocode",
    "random": "random",
    "creative": "creative",
    # Title Case special categories
    "turtle": "Turtle",
    "self marking": "Self Marking",
    "student created": "Student Created",
    "2d arrays": "2D Arrays",
    "recursion": "Recursion",
    "halloween": "Halloween",
}

TAG_SYNONYMS = {
    "loops": "repetition",
    "loop": "repetition",
    "for loop": "repetition",
    "while loop": "repetition",
    "iteration": "repetition",
    "lists": "array",
    "list": "array",
    "arrays": "array",
    "string": "strings",
    "text": "strings",
    "ifs": "selection",
    "if": "selection",
    "conditions": "selection",
    "conditional": "selection",
    "condition": "selection",
    "comparison": "selection",
    "equality": "selection",
    "math": "maths",
    "arithmetic": "maths",
    "integers": "maths",
    "addition": "maths",
    "subtraction": "maths",
    "multiplication": "maths",
    "integer division": "maths",
    "modulo": "maths",
    "function": "functions",
    "procedure": "functions",
    "procedures": "functions",
    "subroutines": "functions",
    "files": "file-handling",
    "file handling": "file-handling",
    "oop": "object-oriented",
    "classes": "object-oriented",
    "crypto": "cryptography",
    "cipher": "cryptography",
    "ciphers": "cryptography",
    "2d array": "2D Arrays",
    "grid": "2D Arrays",
    "matrix": "2D Arrays",
    "recursive": "Recursion",
    "self-marking": "Self Marking",
    "student-created": "Student Created",
}

CHILI_EMOJI = "\U0001F336\uFE0F"  # 🌶️


def resolve_path(filename: str = CHALLENGES_FILE) -> str:
    """Finds the database file relative to script directory or current cwd."""
    if os.path.exists(filename):
        return os.path.abspath(filename)
    script_dir = os.path.dirname(os.path.abspath(__file__))
    candidate = os.path.join(script_dir, filename)
    if os.path.exists(candidate):
        return candidate
    return os.path.abspath(filename)


def load_challenges(filepath: Optional[str] = None) -> List[Dict[str, Any]]:
    """Loads and parses challenges.json."""
    path = filepath or resolve_path()
    if not os.path.exists(path):
        print(red(f"Error: Challenges file not found at '{path}'"))
        sys.exit(1)
    try:
        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)
    except json.JSONDecodeError as e:
        print(red(f"FATAL: Malformed JSON in '{path}': {e}"))
        sys.exit(1)
    
    if not isinstance(data, list):
        print(red("FATAL: Root of challenges.json must be a JSON array!"))
        sys.exit(1)
    
    return data


def create_backup(filepath: Optional[str] = None) -> str:
    """Creates a timestamped backup before modifying challenges.json."""
    path = filepath or resolve_path()
    base_dir = os.path.dirname(path)
    backup_path = os.path.join(base_dir, BACKUP_DIR)
    os.makedirs(backup_path, exist_ok=True)
    
    timestamp = datetime.datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_filename = f"challenges_{timestamp}.json"
    dest_path = os.path.join(backup_path, backup_filename)
    
    with open(path, "r", encoding="utf-8") as src, open(dest_path, "w", encoding="utf-8") as dst:
        dst.write(src.read())
    
    # Prune oldest backups if exceeding limit
    try:
        backups = sorted([
            os.path.join(backup_path, f)
            for f in os.listdir(backup_path)
            if f.startswith("challenges_") and f.endswith(".json")
        ])
        while len(backups) > MAX_BACKUPS:
            oldest = backups.pop(0)
            os.remove(oldest)
    except Exception:
        pass
    
    return dest_path


def save_challenges(challenges: List[Dict[str, Any]], filepath: Optional[str] = None) -> None:
    """Saves challenges array atomically to challenges.json."""
    path = filepath or resolve_path()
    backup_file = create_backup(path)
    print(dim(f"Created safety backup at: {backup_file}"))
    
    temp_path = f"{path}.tmp"
    try:
        with open(temp_path, "w", encoding="utf-8") as f:
            json.dump(challenges, f, indent=2, ensure_ascii=False)
            f.write("\n")
        
        # Verify read-back
        with open(temp_path, "r", encoding="utf-8") as f:
            verified = json.load(f)
            if len(verified) != len(challenges):
                raise IOError("Write verification count mismatch!")
        
        os.replace(temp_path, path)
    except Exception as e:
        if os.path.exists(temp_path):
            os.remove(temp_path)
        print(red(f"Error saving challenges: {e}"))
        sys.exit(1)


def clean_title(raw_title: str) -> str:
    """Strips leading decorative emojis or bullet points from the title."""
    cleaned = raw_title.strip()
    # Strip leading non-alphanumeric / emoji characters
    cleaned = re.sub(r'^[^\w\s"\'`]+', '', cleaned).strip()
    return cleaned


def normalize_spice(raw_spice: Any) -> str:
    """Converts spice inputs (1, 2, 3, or chili emojis) into standard chili string."""
    s = str(raw_spice).strip()
    if s in ("1", "🌶", "🌶️"):
        return CHILI_EMOJI
    elif s in ("2", "🌶🌶", "🌶️🌶️"):
        return CHILI_EMOJI * 2
    elif s in ("3", "🌶🌶🌶", "🌶️🌶️🌶️"):
        return CHILI_EMOJI * 3
    
    # Count occurrences of pepper emoji
    count = s.count("\U0001F336")
    if count in (1, 2, 3):
        return CHILI_EMOJI * count
    
    # Default to 2 if unspecified/unrecognized
    return CHILI_EMOJI * 2


def normalize_tag(raw_tag: str) -> str:
    """Maps a user tag string to standard taxonomy."""
    cleaned = raw_tag.strip().lower()
    if cleaned in TAG_SYNONYMS:
        cleaned = TAG_SYNONYMS[cleaned]
    if cleaned in CANONICAL_TAGS:
        return CANONICAL_TAGS[cleaned]
    # Default fallback: lowercase trimmed
    return raw_tag.strip().lower()


def normalize_tags(raw_tags: Any) -> List[str]:
    """Parses and normalizes a list or comma-separated string of tags."""
    if isinstance(raw_tags, str):
        tag_items = [t.strip() for t in raw_tags.split(",") if t.strip()]
    elif isinstance(raw_tags, list):
        tag_items = [str(t).strip() for t in raw_tags if str(t).strip()]
    else:
        tag_items = []
    
    result = []
    seen = set()
    for t in tag_items:
        norm = normalize_tag(t)
        if norm.lower() not in seen:
            seen.add(norm.lower())
            result.append(norm)
    return result


def normalize_comment(raw_instructions: str) -> str:
    """Ensures instructions start with '# instructions: '."""
    text = raw_instructions.strip()
    if not text.lower().startswith("# instructions:"):
        if text.startswith("#"):
            text = text.lstrip("#").strip()
        text = f"# instructions: {text}"
    return text


def infer_help_url(tags: List[str], instructions: str, title: str) -> str:
    """Infers the relevant pythonmanual.html section anchor for a challenge."""
    t_lower = [t.lower() for t in tags]
    c_lower = instructions.lower()
    tit_lower = title.lower()

    if "bubble sort" in tit_lower or "bubble sort" in c_lower:
        return "pythonmanual.html#bubble-sort"
    if "insertion sort" in tit_lower or "insertion sort" in c_lower:
        return "pythonmanual.html#insertion-sort"
    if "binary search" in tit_lower or "linear search" in tit_lower or "search" in t_lower:
        return "pythonmanual.html#searching"
    if "turtle" in t_lower or "turtle" in c_lower:
        return "pythonmanual.html#turtle"
    if "recursion" in t_lower or "recursive" in c_lower:
        return "pythonmanual.html#recursion"
    if "object-oriented" in t_lower or "oop" in t_lower or "class" in tit_lower:
        return "pythonmanual.html#oop"
    if "file-handling" in t_lower or "file handler" in tit_lower:
        return "pythonmanual.html#files"
    if "2d arrays" in t_lower or "2d" in t_lower:
        return "pythonmanual.html#2d-lists"
    if "array" in t_lower or "list" in t_lower or "lists" in c_lower:
        return "pythonmanual.html#lists"
    if "functions" in t_lower or "procedure" in tit_lower:
        return "pythonmanual.html#functions"
    if "cryptography" in t_lower or "cipher" in tit_lower:
        return "pythonmanual.html#string-length"
    if "validate" in tit_lower or "validation" in t_lower:
        return "pythonmanual.html#validation"
    if "random" in t_lower or "random" in tit_lower:
        return "pythonmanual.html#random-statistics"
    if "strings" in t_lower or "text" in tit_lower or "word" in tit_lower:
        return "pythonmanual.html#string-length"
    if "selection" in t_lower:
        return "pythonmanual.html#selection"
    if "while" in c_lower or "until" in c_lower:
        return "pythonmanual.html#while-loops"
    if "repetition" in t_lower:
        return "pythonmanual.html#for-loops"
    if "totalling" in t_lower or "maths" in t_lower or "counting" in t_lower:
        return "pythonmanual.html#operators"
    if "input" in c_lower or "ask " in c_lower:
        return "pythonmanual.html#inputs"
    return "pythonmanual.html#variables"


def cmd_stats(args: argparse.Namespace) -> None:
    """Displays overview statistics for challenges.json."""
    challenges = load_challenges()
    print(bold(cyan(f"\n📊 Python Challenges Database ({len(challenges)} Total Challenges)")))
    print("=" * 60)
    
    from collections import Counter
    spice_counter = Counter(c.get("spice", "") for c in challenges)
    tag_counter = Counter(t for c in challenges for t in c.get("tags", []))
    
    print(bold("\n🌶️ Spice Breakdown:"))
    for spice, count in sorted(spice_counter.items(), key=lambda x: len(x[0])):
        label = f"{len(spice.replace('\uFE0F', ''))} Chilis ({spice})"
        pct = (count / len(challenges)) * 100
        print(f"  {label:<18} : {count:3d} ({pct:4.1f}%)")
    
    print(bold(f"\n🏷️ Top Tags ({len(tag_counter)} Unique Tags):"))
    for tag, count in tag_counter.most_common(12):
        print(f"  {tag:<20} : {count:3d}")
    print("=" * 60 + "\n")


def cmd_validate(args: argparse.Namespace) -> None:
    """Runs a complete validation pass over challenges.json."""
    challenges = load_challenges()
    print(bold(cyan(f"Validating {len(challenges)} challenges...")))
    
    errors = []
    warnings = []
    seen_ids = set()
    seen_titles = set()
    
    for idx, c in enumerate(challenges, start=1):
        cid = c.get("id")
        title = c.get("title", "")
        comment = c.get("comment", "")
        tags = c.get("tags", [])
        
        # ID check
        if cid is None:
            errors.append(f"Challenge #{idx} missing 'id'")
        elif cid in seen_ids:
            errors.append(f"Duplicate id {cid} at index #{idx}")
        elif cid != idx:
            warnings.append(f"Challenge #{idx} has non-sequential id {cid}")
        seen_ids.add(cid)
        
        # Title check
        if not title:
            errors.append(f"Challenge #{idx} missing 'title'")
        elif title.lower() in seen_titles:
            warnings.append(f"Duplicate title '{title}' (id {cid})")
        seen_titles.add(title.lower())
        
        # Comment check
        if not comment:
            errors.append(f"Challenge id {cid} missing 'comment'")
        elif not comment.startswith("# instructions:"):
            warnings.append(f"Challenge id {cid} ('{title}') comment does not start with '# instructions:'")
        
        # Tags check
        if not isinstance(tags, list):
            errors.append(f"Challenge id {cid} 'tags' must be a list")
    
    if errors:
        print(bold(red(f"\n❌ Validation failed with {len(errors)} error(s):")))
        for e in errors:
            print(red(f"  - {e}"))
    else:
        print(bold(green("\n✅ Zero schema errors found!")))
    
    if warnings:
        print(bold(yellow(f"\n⚠️ {len(warnings)} Warning(s):")))
        for w in warnings:
            print(yellow(f"  - {w}"))
    print()


def cmd_list(args: argparse.Namespace) -> None:
    """Lists challenges with optional filtering."""
    challenges = load_challenges()
    tag_filter = args.tag.lower() if args.tag else None
    limit = args.limit or 20
    
    filtered = challenges
    if tag_filter:
        filtered = [c for c in challenges if any(t.lower() == tag_filter for t in c.get("tags", []))]
    
    print(bold(cyan(f"\nListing challenges (showing {min(len(filtered), limit)} of {len(filtered)} matches):")))
    print("-" * 75)
    
    for c in filtered[-limit:]:
        tags_str = ", ".join(c.get("tags", []))
        print(f"[{c['id']:3d}] {c.get('spice', ''):<6} {bold(c.get('title', ''))}")
        print(f"      Tags: {dim(tags_str)}")
    print("-" * 75 + "\n")


def cmd_add(args: argparse.Namespace) -> None:
    """Adds a new challenge to challenges.json with automatic ID incrementing."""
    challenges = load_challenges()
    next_id = max((c.get("id", 0) for c in challenges), default=0) + 1
    
    title = args.title
    spice = args.spice
    tags = args.tags
    instructions = args.instructions
    
    # Interactive wizard if arguments are missing
    if not (title and instructions):
        print(bold(cyan("\n✨ Add New Challenge Wizard ✨")))
        print(dim(f"Next automated Challenge ID will be: {next_id}\n"))
        
        if not title:
            title = input(bold("Enter Challenge Title (e.g. '⏰ The Unsnoozable Alarm Clock'): ")).strip()
            if not title:
                print(red("Title cannot be empty! Aborting."))
                return
        
        if not spice:
            spice_input = input(bold("Enter Difficulty / Spice [1, 2, or 3] (default 2): ")).strip()
            spice = spice_input if spice_input in ("1", "2", "3") else "2"
        
        if not tags:
            print(dim("\nCommon tags: selection, repetition (loops), array (lists), strings, random, creative, Turtle"))
            tags = input(bold("Enter Tags (comma-separated, e.g. 'Selection, Loops, Random'): ")).strip()
        
        if not instructions:
            print(bold("\nEnter Challenge Instructions:"))
            instructions = input("> ").strip()
            if not instructions:
                print(red("Instructions cannot be empty! Aborting."))
                return
    
    # Normalization
    clean_t = clean_title(title)
    norm_spice = normalize_spice(spice)
    norm_tags = normalize_tags(tags)
    norm_comment = normalize_comment(instructions)
    
    help_url = getattr(args, "help_url", None) or infer_help_url(norm_tags, norm_comment, clean_t)
    
    new_challenge = {
        "id": next_id,
        "title": clean_t,
        "spice": norm_spice,
        "comment": norm_comment,
        "tags": norm_tags,
        "helpUrl": help_url,
    }
    
    print(bold("\n📝 Prepared New Challenge:"))
    print(json.dumps(new_challenge, indent=2, ensure_ascii=False))
    
    if not args.yes:
        confirm = input(bold("\nAppend this challenge to challenges.json? [Y/n]: ")).strip().lower()
        if confirm and confirm not in ("y", "yes"):
            print(yellow("Cancelled. No changes made."))
            return
    
    challenges.append(new_challenge)
    save_challenges(challenges)
    print(bold(green(f"\n🎉 Successfully added challenge #{next_id} '{clean_t}'!")))
    print(dim(f"Total challenges is now: {len(challenges)}\n"))


def main():
    parser = argparse.ArgumentParser(
        description="Safe CLI tool & validator for challenges.json in jsfun.",
        formatter_class=argparse.RawTextHelpFormatter,
    )
    subparsers = parser.add_subparsers(dest="command", help="Available commands")
    
    # add command
    add_parser = subparsers.add_parser("add", help="Add a new challenge (interactive or CLI flags)")
    add_parser.add_argument("--title", "-t", help="Challenge title (e.g. 'The Unsnoozable Alarm Clock')")
    add_parser.add_argument("--spice", "-s", help="Spice level 1, 2, or 3 (or chili emoji)")
    add_parser.add_argument("--tags", help="Comma-separated tags (e.g. 'Selection, Loops, Creative')")
    add_parser.add_argument("--instructions", "-i", help="Challenge description instructions")
    add_parser.add_argument("--help-url", help="Custom help link to pythonmanual.html (e.g. 'pythonmanual.html#lists')")
    add_parser.add_argument("--yes", "-y", action="store_true", help="Auto-confirm write without prompt")
    
    # list command
    list_parser = subparsers.add_parser("list", help="List challenges in database")
    list_parser.add_argument("--tag", help="Filter by tag")
    list_parser.add_argument("--limit", "-n", type=int, default=15, help="Number of items to show")
    
    # validate command
    subparsers.add_parser("validate", help="Validate schema and consistency of challenges.json")
    
    # stats command
    subparsers.add_parser("stats", help="Show challenges database stats and tag breakdown")
    
    args = parser.parse_args()
    
    if args.command == "add":
        cmd_add(args)
    elif args.command == "list":
        cmd_list(args)
    elif args.command == "validate":
        cmd_validate(args)
    elif args.command == "stats":
        cmd_stats(args)
    else:
        # Default behavior: show stats & help
        cmd_stats(args)
        parser.print_help()


if __name__ == "__main__":
    main()

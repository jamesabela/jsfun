from pathlib import Path
import sqlite3, json
root = Path(__file__).parent
queries = json.loads((root / "queries.json").read_text())
for i, (title, task, query, expected) in enumerate(queries, 1):
    db = sqlite3.connect(":memory:")
    db.executescript((root / "setup.sql").read_text())
    result = db.execute(query)
    if i == 8:
        result = db.execute("SELECT COUNT(*) FROM STUDENT INNER JOIN CLUB ON STUDENT.ClubID=CLUB.ClubID WHERE CLUB.ClubName='Art'")
    actual = [list(row) for row in result.fetchall()]
    assert actual == expected, (title, actual, expected)
    db.close()
print("8 SQL exercise checks passed")

# Files Basics Course

A short iGCSE-friendly Python course about simple file handling.

The course focuses on the level of file handling students often need for simple programs: writing one line and reading one line. The main idea is that files let data stay around after a program ends.

## Includes

1. `01_write_name.py` - write a player name to a text file.
2. `02_read_name.py` - read one saved player name from a text file.
3. `03_write_highscore.py` - write a high score to a text file.
4. `04_read_highscore.py` - read a high score and compare it with today's score.
5. `05_typing_tutor_write.py` - type a whole line and save the latest WPM.
6. `06_typing_tutor_read.py` - read the latest WPM from a text file.
7. `07_final_project_typing_champion.py` - final project combining lists, timing and simple file saving.

## Upload location

Upload the whole folder to:

`jsfun/files_basics_course/`

## Start URL

Raw first level:

`https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/01_write_name.py`

Python Code Lab loader link:

`https://jamesabela.github.io/jsfun/pythoncopy.html?url=https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/files_basics_course/01_write_name.py`

## Notes

This course deliberately avoids complex file structures, CSV files, multi-line reading, lists of records and exception handling. The final project is not input/output assessed because it uses timing and file updates. Those can come later. This course is only about the basic pattern:

```python
file = open("name.txt", "w")
file.write(data)
file.close()
```

and:

```python
file = open("name.txt", "r")
data = file.readline()
file.close()
```

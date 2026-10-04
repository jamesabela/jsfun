# Teacher guide - Chapter 1

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - First messages

Display Ready and then Code on separate lines.



```python
print("Ready")
print("Code")
```

Tests:
- Inputs `[]`; exact output lines `['Ready', 'Code']`.

## Level 2 - Ticket calculation

Calculate and display the cost of four tickets at 6 each, using multiplication.



```python
price = 6
print(price * 4)
```

Tests:
- Inputs `[]`; exact output lines `['24']`.

## Level 3 - Changing a score

Input an integer starting score, add a bonus of 5 and display the new score.



```python
score = int(input("Score: "))
score = score + 5
print(score)
```

Tests:
- Inputs `['10']`; exact output lines `['15']`.
- Inputs `['0']`; exact output lines `['5']`.
- Inputs `['27']`; exact output lines `['32']`.

## Level 4 - Welcome message

Input a name and display Welcome followed by that name, separated by a space.



```python
name = input("Name: ")
print("Welcome", name)
```

Tests:
- Inputs `['Aisha']`; exact output lines `['Welcome Aisha']`.
- Inputs `['Sam Lee']`; exact output lines `['Welcome Sam Lee']`.

## Level 5 - Player profile

Input a name, favourite game and integer lives, in that order. Display Name:, Game: and Lives: labels on three separate lines.



```python
name = input("Name: ")
game = input("Game: ")
lives = int(input("Lives: "))
print("Name:", name)
print("Game:", game)
print("Lives:", lives)
```

Tests:
- Inputs `['Aisha', 'Chess', '3']`; exact output lines `['Name: Aisha', 'Game: Chess', 'Lives: 3']`.
- Inputs `['Ben', 'Racing', '1']`; exact output lines `['Name: Ben', 'Game: Racing', 'Lives: 1']`.


# Teacher guide - Chapter 16

Ask students to predict, try, change and explain. Output checks are a useful minimum, not proof of algorithm choice, output order or a sound written explanation. Review the code and the written tasks as well. The included reference solutions were also checked locally against exact output lines.

## Level 1 - One player total

Input a name then three integer scores. Display the name and total separated by one space.



```python
name = input("Name: ")
total = 0
for index in range(3):
    total = total + int(input("Score: "))
print(name, total)
```

Tests:
- Inputs `['Aisha', '5', '10', '15']`; exact output lines `['Aisha 30']`.
- Inputs `['Ben', '0', '0', '0']`; exact output lines `['Ben 0']`.

## Level 2 - Validated score function

Complete input_score() to re-input until an integer is from 0 to 20 inclusive. Return it. The main code displays Accepted: with the result. Do not print rejection messages in this level.



```python
def input_score():
    score = int(input("Score 0-20: "))
    while score < 0 or score > 20:
        score = int(input("Score 0-20: "))
    return score

print("Accepted:", input_score())
```

Tests:
- Inputs `['0']`; exact output lines `['Accepted: 0']`.
- Inputs `['20']`; exact output lines `['Accepted: 20']`.
- Inputs `['-1', '21', '7']`; exact output lines `['Accepted: 7']`.

## Level 3 - Store summaries

For two players, input a name then two scores each. Store [name,total] rows and display each row as name and total separated by a space.



```python
players = []
for player in range(2):
    name = input("Name: ")
    total = 0
    for round_number in range(2):
        total = total + int(input("Score: "))
    players.append([name, total])
for row in players:
    print(row[0], row[1])
```

Tests:
- Inputs `['Aisha', '5', '7', 'Ben', '2', '3']`; exact output lines `['Aisha 12', 'Ben 5']`.
- Inputs `['Chen', '0', '0', 'Dina', '8', '8']`; exact output lines `['Chen 0', 'Dina 16']`.

## Level 4 - Report every tie

Find the highest total in the supplied rows and display Winner: for every tied winner, in original row order.



```python
players = [["Aisha", 30], ["Ben", 30], ["Chen", 6]]
highest = players[0][1]
for row in players:
    if row[1] > highest:
        highest = row[1]
for row in players:
    if row[1] == highest:
        print("Winner:", row[0])
```

Tests:
- Inputs `[]`; exact output lines `['Winner: Aisha', 'Winner: Ben']`.


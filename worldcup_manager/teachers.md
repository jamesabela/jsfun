# Teacher Guide - World Cup Dream Manager

This guide gives the teaching focus and one possible solution for each level.

## Level 1: Choose Your Dream Country

Focus: input and output in a football manager context.

```python
country = input("Choose your country: ")
print(country, "World Cup Dream starts now")
```

## Level 2: Choose Women or Men

Focus: selection in a football manager context.

```python
team = input("Choose women or men: ").lower()
if team == "women":
    print("Women's World Cup Dream")
elif team == "men":
    print("Men's World Cup Dream")
else:
    print("Choose women or men")
```

## Level 3: Build a Country Rating

Focus: maths in a football manager context.

```python
attack = int(input("Attack rating: "))
defence = int(input("Defence rating: "))
stamina = int(input("Stamina rating: "))
rating = attack + defence + stamina
print("Rating:", rating)
if rating >= 210:
    print("World Cup contender")
else:
    print("Underdog dream")
```

## Level 4: Pick a Starting Squad

Focus: lists in a football manager context.

```python
squad = []
squad.append("Aina Rahman")
squad.append("Siti Noor")
squad.append("Maya Lim")
squad.append("Nadia Tan")
print("Starting squad")
print(squad)
```

## Level 5: Training Points

Focus: random in a football manager context.

```python
name = input("Player name: ")
base_rating = int(input("Base rating: "))
training_points = int(input("Training points: "))
boost = training_points // 2
final_rating = base_rating + boost
print(name, "final rating", final_rating)
```

## Level 6: Play a Friendly Match

Focus: simulation in a football manager context.

```python
import random
home = input("Home team: ")
away = input("Away team: ")
home_goals = random.randint(0, 5)
away_goals = random.randint(0, 5)
print(home, home_goals, "-", away_goals, away)
if home_goals > away_goals:
    print("Home win")
elif away_goals > home_goals:
    print("Away win")
else:
    print("Draw")
```

## Level 7: Goal Difference Matters

Focus: maths in a football manager context.

```python
team = input("Team: ")
scored = int(input("Goals scored: "))
conceded = int(input("Goals conceded: "))
goal_difference = scored - conceded
if scored > conceded:
    points = 3
elif scored == conceded:
    points = 1
else:
    points = 0
print(team, "points", points)
print(team, "goal difference", goal_difference)
```

## Level 8: Build a Group Table

Focus: 2d lists in a football manager context.

```python
group = [["Malaysia",0,0],["Malta",0,0],["Brazil",0,0],["New Zealand",0,0]]
winner = input("Winning country: ")
margin = int(input("Goal difference margin: "))
for team in group:
    if team[0] == winner:
        team[1] = team[1] + 3
        team[2] = team[2] + margin
print(group)
```

## Level 9: Penalty Shootout

Focus: loops in a football manager context.

```python
import random
team = input("Your team: ")
opponent = input("Opponent: ")
team_score = 0
opponent_score = 0
for i in range(5):
    team_score = team_score + random.randint(0, 1)
    opponent_score = opponent_score + random.randint(0, 1)
print(team, team_score, "-", opponent_score, opponent)
```

## Level 10: Draw the Dream Stadium

Focus: turtle in a football manager context.

```python
import turtle
turtle.bgcolor("dark green")
turtle.color("white")
turtle.speed(0)
turtle.penup()
turtle.goto(-160, 100)
turtle.pendown()
for i in range(2):
    turtle.forward(320)
    turtle.right(90)
    turtle.forward(200)
    turtle.right(90)
turtle.penup()
turtle.goto(0, 100)
turtle.pendown()
turtle.right(90)
turtle.forward(200)
turtle.penup()
turtle.goto(0, -20)
turtle.pendown()
turtle.circle(20)
turtle.penup()
turtle.goto(-145, 130)
turtle.write("World Cup Dream Stadium", font=("Arial", 14, "bold"))
print("Stadium complete")
turtle.done()
```

## Level 11: Load Country Data

Focus: files in a football manager context.

```python
search_country = input("Country to search for: ")
team_type = input("women or men: ").lower()
found = False
with open("countries.csv") as file:
    headings = file.readline()
    for line in file:
        parts = line.strip().split(",")
        country = parts[0]
        region = parts[1]
        mens_rating = parts[2]
        womens_rating = parts[3]
        story = parts[4]
        if country.lower() == search_country.lower():
            found = True
            if team_type == "women":
                print(country, region, womens_rating)
            else:
                print(country, region, mens_rating)
if found == False:
    print("Country not found")
```

## Level 12: Build Your World Cup

Focus: final project in a football manager context.

```python
import random
print("World Cup Dream Manager")
country = input("Choose your country: ")
team_type = input("women or men: ").lower()
points = 0
goal_difference = 0
opponents = ["Malta", "Brazil", "New Zealand"]
for opponent in opponents:
    my_goals = random.randint(0, 4)
    their_goals = random.randint(0, 4)
    print(country, my_goals, "-", their_goals, opponent)
    goal_difference = goal_difference + my_goals - their_goals
    if my_goals > their_goals:
        points = points + 3
    elif my_goals == their_goals:
        points = points + 1
print("Points", points)
print("Goal difference", goal_difference)
if points >= 4:
    print("The dream continues to penalties")
    our_pens = 0
    their_pens = 0
    for i in range(5):
        our_pens = our_pens + random.randint(0, 1)
        their_pens = their_pens + random.randint(0, 1)
    print(country, our_pens, "-", their_pens, "Opponent")
else:
    print("The dream ends, but the country believes again")
print("Dream complete")
```

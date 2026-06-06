# World Cup Dream Manager - Level 5
# Tutorial: https://jamesabela.github.io/jsfun/worldcup_manager/05_training_points.html
# Your task: improve a player's rating using training points.

name = input("Player name: ")
base_rating = int(input("Base rating: "))
training_points = int(input("Training points: "))

# Every 2 training points gives 1 rating point.
boost = 0
final_rating = base_rating

# TODO: calculate boost using integer division.
# TODO: calculate final_rating.

print(name, "final rating", final_rating)

#Input
# Aina, 70, 10
# Liam, 64, 7
# Maya, 80, 4

#output
# Aina, final rating, 75
# Liam, final rating, 67
# Maya, final rating, 82

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/06_random_match.py

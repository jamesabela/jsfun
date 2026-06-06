# World Cup Dream Manager - Level 7
# Tutorial: https://jamesabela.github.io/jsfun/worldcup_manager/07_goal_difference.html
# Your task: calculate points and goal difference from one result.

team = input("Team: ")
scored = int(input("Goals scored: "))
conceded = int(input("Goals conceded: "))

points = 0
goal_difference = 0

# TODO: calculate goal_difference.
# TODO: 3 points for a win, 1 for a draw, 0 for a defeat.

print(team, "points", points)
print(team, "goal difference", goal_difference)

#Input
# Malaysia, 2, 1
# Malta, 1, 1
# Jamaica, 0, 3

#output
# Malaysia, points, 3, goal difference, 1
# Malta, points, 1, goal difference, 0
# Jamaica, points, 0, goal difference, -3

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/08_group_table.py

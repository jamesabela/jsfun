# World Cup Dream Manager - Level 8
# Tutorial: https://jamesabela.github.io/jsfun/worldcup_manager/08_group_table.html
# Your task: update a simple group table stored as a 2D list.

# Each team is stored as: [country, points, goal_difference]
group = [
    ["Malaysia", 0, 0],
    ["Malta", 0, 0],
    ["Brazil", 0, 0],
    ["New Zealand", 0, 0]
]

winner = input("Winning country: ")
margin = int(input("Goal difference margin: "))

# TODO: find the winning country in the group.
# TODO: add 3 points to that country.
# TODO: add margin to that country's goal difference.

print(group)

#Input
# Malaysia, 2
# Malta, 1

#output
# Malaysia, 3, 2
# Malta, 3, 1

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/09_penalty_shootout.py

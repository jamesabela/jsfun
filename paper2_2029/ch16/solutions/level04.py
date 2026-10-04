players = [["Aisha", 30], ["Ben", 30], ["Chen", 6]]
highest = players[0][1]
for row in players:
    if row[1] > highest:
        highest = row[1]
for row in players:
    if row[1] == highest:
        print("Winner:", row[0])

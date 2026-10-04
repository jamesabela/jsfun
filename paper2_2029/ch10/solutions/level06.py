players = [["Aisha", 12], ["Ben", 18], ["Chen", 9]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(players) - 1):
        if players[index][1] < players[index + 1][1]:
            temporary = players[index]
            players[index] = players[index + 1]
            players[index + 1] = temporary
            swapped = True
for row in players:
    print(row[0], row[1])

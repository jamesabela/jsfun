players = []
for player in range(2):
    name = input("Name: ")
    total = 0
    for round_number in range(2):
        total = total + int(input("Score: "))
    players.append([name, total])
for row in players:
    print(row[0], row[1])

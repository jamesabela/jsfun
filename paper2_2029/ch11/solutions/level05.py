with open("scores.txt", "w") as file:
    file.write("12\n18\n9\n")
total = 0
with open("scores.txt", "r") as file:
    for line in file:
        total = total + int(line)
print("Total:", total)

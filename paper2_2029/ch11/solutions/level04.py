with open("lines.txt", "w") as file:
    file.write("One\nTwo\nThree\n")
with open("lines.txt", "r") as file:
    lines = file.readlines()
print("Lines:", len(lines))

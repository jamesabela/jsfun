with open("names.txt", "w") as file:
    file.write("Aisha\n")
name = input("Name: ")
with open("names.txt", "a") as file:
    file.write(name + "\n")
with open("names.txt", "r") as file:
    print(file.read(), end="")

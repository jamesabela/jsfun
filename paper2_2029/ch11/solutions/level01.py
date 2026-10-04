with open("message.txt", "w") as file:
    file.write("Ready\n")
with open("message.txt", "r") as file:
    text = file.read()
print(text, end="")

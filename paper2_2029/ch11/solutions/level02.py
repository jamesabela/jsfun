with open("notice.txt", "w") as file:
    file.write("Keep learning.\n")
with open("notice.txt", "r") as file:
    text = file.read()
print(text, end="")
print(text.upper(), end="")

#load https://raw.githubusercontent.com/jamesabela/FileHandlingTutorial/refs/heads/main/rudyard.txt
# Learn more about file handling at: https://jamesabela.github.io/jsfun/examples/file_load.html

with open("rudyard.txt", "r") as whole_file:
    for line in whole_file:
        print(line, end="")

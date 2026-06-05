# https://jamesabela.github.io/jsfun/dictionaries_course/10_final_project.html
# Level 10 of 10 - Dictionaries

# Final project - Dictionary App
# Build your own dictionary-powered tool.
# Ideas:
# 1. Shakespeare word helper
# 2. Game item database
# 3. Computer science glossary
# 4. Country capital quiz
# 5. RPG inventory

glossary = {
    "dictionary": "Stores key-value pairs",
    "key": "The unique label used to find a value",
    "value": "The data stored against a key"
}

print("Dictionary App")
print("Type a word to look up, or type quit to stop.")

while True:
    search = input("Search: ").lower()
    if search == "quit":
        break

    print(glossary.get(search, "Not found yet. Add it to your project!"))

print("Project finished")

#End Python Dictionaries

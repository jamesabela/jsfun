# Tutorial: https://jamesabela.github.io/jsfun/whileloops/08_menu_loop.html

# Level 8 - Menu Loop
# Keep showing the menu until the user types q.

choice = ""

while choice != "q":
    print("1 - Hello")
    print("2 - Joke")
    print("q - Quit")

    choice = input("Choice: ")

    if choice == "1":
        print("Hello")
    elif choice == "2":
        print("Computer jokes are byte-sized")

print("Goodbye")

#Input
# q
# 1, q
# 2, q

#output
# Goodbye
# Hello
# Goodbye
# Computer jokes are byte-sized
# Goodbye

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/whileloops/09_input_validation.py

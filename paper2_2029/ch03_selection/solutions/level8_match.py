option = int(input("Choose 1-3: "))
match option:
    case 1:
        print("Play")
    case 2:
        print("Settings")
    case 3:
        print("Quit")
    case _:
        print("Invalid")

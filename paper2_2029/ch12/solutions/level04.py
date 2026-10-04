code = input("Code: ")
valid = False
if len(code) == 4:
    if code[0] in "ABCDEFGHIJKLMNOPQRSTUVWXYZ":
        valid = True
        for index in range(1, 4):
            if code[index] not in "0123456789":
                valid = False
print("Valid:", valid)

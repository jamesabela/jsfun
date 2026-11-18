#Ask the user to input a password.
#If password is correct, display correct password.
#If password is incorrect, display incorrect password.
#The program will loop until the correct answer is entered.
#Hint: use attempts = False

status = False #Boolean Data

while status == False:
    password = input("Enter password: ")
    if password == "GISKLumpur":
        print("Password corect")
        status = True

    else:
        print("Bad")

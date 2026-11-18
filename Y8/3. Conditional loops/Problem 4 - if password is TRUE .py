accepted = False
password = "Pa$sword1sStr0ng!"

while accepted == False:
    enterpassword = str(input("Please enter your password:  "))

    if enterpassword == password:
        print("Password matches!")
        accepted = True
    else:
        print("Password is incorrect")



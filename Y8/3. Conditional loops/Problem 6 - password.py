username = input("Enter  username: ")
while len(username) < 8:
    username = input("Your username is not valid, enter another username")
print("Your username has been accepted")

password = input("Enter a password: ")
while len(password) < 8 or len(password) > 15:
    password = input("Invalid password, enter another password")
print("Your password has been accepted")


member_text = input("Member? True/False: ")
member = member_text == "True"
points = int(input("Points: "))
if member == True:
    if points >= 100:
        print("Reward unlocked")
    else:
        print("More points needed")
else:
    print("Membership required")

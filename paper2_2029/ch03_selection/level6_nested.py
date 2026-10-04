# Learn more: https://jamesabela.github.io/jsfun/paper2_2029/ch03_selection/level6_nested.html
member_text = input("Member? True/False: ")
member = member_text == "True"
points = int(input("Points: "))
if member == True:
    if points > 100:
        print("Reward unlocked")
    else:
        print("More points needed")
else:
    print("Membership required")

#Input
# True, 100
# True, 80
# False, 150
#output
# Reward unlocked
# More points needed
# Membership required
#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/paper2_2029/ch03_selection/level7_strings.py

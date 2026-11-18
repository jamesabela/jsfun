# Tutorial: https://jamesabela.github.io/jsfun/Y8/lessons/u1_08_theme_park.html

group_size = int(input("How many people are coming? "))
pocket_money = int(input("How much spending money does each person have (£)? "))

total_budget = group_size * pocket_money
entry_pass_total = group_size * 25  # Each entry pass is £25

# Add parking_fee = 5 and subtract it from money_left
money_left = total_budget - entry_pass_total
print("After buying entry passes, your group has £", money_left, "left for food!")

#Input
# 4, 30
# 3, 40

#output
# 15
# 40

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/Y8/lessons/u1_09_retirement.py

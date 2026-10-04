highest = int(input("First: "))
for index in range(2):
    value = int(input("Next: "))
    if value > highest:
        highest = value
print("Highest:", highest)

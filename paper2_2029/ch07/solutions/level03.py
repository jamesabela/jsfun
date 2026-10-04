first = int(input("First: "))
highest = first
lowest = first
for index in range(2):
    value = int(input("Next: "))
    if value > highest:
        highest = value
    if value < lowest:
        lowest = value
print("Highest:", highest)
print("Lowest:", lowest)

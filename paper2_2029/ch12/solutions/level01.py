value = int(input("Value: "))
while value < 1 or value > 8:
    print("Rejected")
    value = int(input("Value: "))
print("Accepted:", value)

count = 0
for index in range(4):
    mark = int(input("Mark: "))
    if mark >= 50:
        count = count + 1
print("Passes:", count)

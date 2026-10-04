summary = [[1, 2], [2, 3], [3, 1], [4, 2]]
swapped = True
while swapped:
    swapped = False
    for index in range(len(summary) - 1):
        if summary[index][1] < summary[index + 1][1]:
            temporary = summary[index]
            summary[index] = summary[index + 1]
            summary[index + 1] = temporary
            swapped = True
for row in summary:
    print("Activity", row[0], "Votes", row[1])

votes = [2, 1, 2, 4, 1, 2, 4, 3]
summary = [[1, 0], [2, 0], [3, 0], [4, 0]]
for index in range(4):
    summary[index][1] = votes.count(summary[index][0])
for row in summary:
    print(row[0], row[1])

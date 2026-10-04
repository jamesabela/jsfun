votes = [0] * 8
summary = []
for activity in range(1, 5):
    summary.append([activity, 0])
print("Size:", len(votes))
for row in summary:
    print(row[0], row[1])

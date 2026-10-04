# Trace and flowchart worksheet

Trace this program for inputs 2, 5 and 8. Record the state after each iteration.

```python
total = 0
large = 0
for index in range(3):
    value = int(input())
    total = total + value
    if value >= 5:
        large = large + 1
print(total, large)
```

Draw a flowchart of the same algorithm. Label decision paths and show where the loop returns. Then change the algorithm to accept four values and count only values strictly greater than 5.

## Model answers

| index | value | total | large |
|---|---|---|---|
| 0 | 2 | 2 | 0 |
| 1 | 5 | 7 | 1 |
| 2 | 8 | 15 | 2 |

Output is `15 2`. Initialise the total, qualifying count and processed count. Test whether fewer than three have been processed; input a value; add it; branch on `value >= 5`; increment the qualifying count on Yes; rejoin; increment processed count; return to the repetition check. Output after No from the repetition check. For the amendment use four repetitions and `value > 5`. See the book's total and count flowcharts for correctly rendered symbols and arrows.

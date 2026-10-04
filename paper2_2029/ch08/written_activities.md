# Search and sort worksheet

1. Trace binary search for 60 in descending data `[95, 80, 60, 45, 30, 20, 5]` using floor division for the middle index.
2. Trace an unsuccessful ascending binary search for 11 in `[2, 5, 9, 14, 20]`.
3. Show insertion stages for `[7, 3, 6, 2]` in ascending order.
4. Starting from singletons `[7] [3] [6] [2]`, show descending merge levels.
5. Explain when linear search may be preferable to binary search.

## Model answers

1. Middle index 3 is 45; target is larger, so keep indices 0-2. Middle index 1 is 80; target is smaller in a descending list, so keep index 2. Index 2 is 60: found.
2. Middle index 2 is 9; low becomes 3. Middle index 3 is 14; high becomes 2. Low exceeds high, so absent.
3. `[3,7,6,2]`, then `[3,6,7,2]`, then `[2,3,6,7]`.
4. `[7,3] [6,2]`, then `[7,6,3,2]`.
5. A short unsorted list requiring one search may not justify sorting first. Linear search does not need ordering.

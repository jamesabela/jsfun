# Tutorial: https://jamesabela.github.io/jsfun/sorts_searches_course/05_binary_search_code.html
# Vocabulary: https://jamesabela.github.io/jsfun/sorts_searches_course/vocabulary.html
# Big O Lab: https://jamesabela.github.io/jsfun/sorts_searches_course/big_o_lab.html
# Exam Support: https://jamesabela.github.io/jsfun/sorts_searches_course/exam_support.html
# Breadcrumb: Level 5 of 12 - Sorts and Searches

numbers = [2, 5, 7, 9, 12, 15, 19, 22, 31]
target = int(input("Target: "))
low = 0
high = len(numbers) - 1
found = False

while low <= high and found == False:
    middle = (low + high) // 2
    if numbers[middle] == target:
        found = True
        print("Found at index", middle)
    elif target < numbers[middle]:
        high = middle - 1
    else:
        low = ___

if found == False:
    print("Not found")

#Input
# 15
# 4

#output
# Found at index 5
# Not found

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/sorts_searches_course/06_worst_case.py

# Tutorial: https://jamesabela.github.io/jsfun/sorts_searches_course/10_insertion_sort.html
# Vocabulary: https://jamesabela.github.io/jsfun/sorts_searches_course/vocabulary.html
# Big O Lab: https://jamesabela.github.io/jsfun/sorts_searches_course/big_o_lab.html
# Exam Support: https://jamesabela.github.io/jsfun/sorts_searches_course/exam_support.html
# Breadcrumb: Level 10 of 12 - Sorts and Searches

numbers = [6, 3, 8, 2]

for i in range(1, len(numbers)):
    key = numbers[i]
    j = i - 1
    while j >= 0 and numbers[j] ___ key:
        numbers[j + 1] = numbers[j]
        j = j - 1
    numbers[j + 1] = key

print(numbers)

#Input
# ""

#output
# [2, 3, 6, 8]

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/sorts_searches_course/11_compare_algorithms.py

# Tutorial: https://jamesabela.github.io/jsfun/sorts_searches_course/08_bubble_sort_full.html
# Vocabulary: https://jamesabela.github.io/jsfun/sorts_searches_course/vocabulary.html
# Big O Lab: https://jamesabela.github.io/jsfun/sorts_searches_course/big_o_lab.html
# Exam Support: https://jamesabela.github.io/jsfun/sorts_searches_course/exam_support.html
# Breadcrumb: Level 8 of 12 - Sorts and Searches

numbers = [9, 4, 7, 1]

for pass_num in range(len(numbers)):
    for i in range(______):
        if numbers[i] > numbers[i + 1]:
            temp = numbers[i]
            numbers[i] = numbers[i + 1]
            numbers[i + 1] = temp

print(numbers)

#Input
# ""

#output
# [1, 4, 7, 9]

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/sorts_searches_course/09_bubble_turtle.py

# Tutorial: https://jamesabela.github.io/jsfun/2dlists/level08_booking_grid.html
# Breadcrumb: Level 8 of 10 - Booking Grid
# A seating plan can be stored as a 2D list.
# O means open. X means booked.
# Complete the validation and booking code.

seats = [
    ["O", "O", "O", "O"],
    ["O", "X", "O", "O"],
    ["O", "O", "O", "O"]
]

row = int(input("Choose row 0 to 2: "))
column = int(input("Choose column 0 to 3: "))

# TODO: Add a range check for row and column.
if row < 0:
    print("Invalid seat")
elif seats[row][column] == "X":
    print("Seat already booked")
else:
    seats[row][column] = "X"
    print("Seat booked")

for seat_row in seats:
    print(*seat_row)

#Input
# 2, 3
# 1, 1
# 5, 0

#output
# Seat booked
# Seat already booked
# Invalid seat

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/2dlists/level09_picture_grid.py
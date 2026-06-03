# Tutorial: https://jamesabela.github.io/jsfun/lists/06_bus_ticket.html

# Level 6: KL Bus Ticket
# This program uses related lists.
# Complete it so the user buys one outgoing ticket and one return ticket.

bus_time = ["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00", "16:00"]
bus_capacity = [40, 40, 40, 40, 40, 40, 40, 64]
bus_money = [0, 0, 0, 0, 0, 0, 0, 0]
charge = 15

out_choice = int(input("Choose outgoing bus 0, 2, 4 or 6: "))
return_choice = int(input("Choose return bus 1, 3, 5 or 7: "))

print("Outgoing:", bus_time[out_choice])
print("Return:", bus_time[return_choice])

# Take one seat from both buses

# Add the ticket money to both buses

print("Capacity:", bus_capacity)
print("Money:", bus_money)

#Input
# 0, 1
# 4, 7

#output
# Outgoing: 09:00, Return: 10:00, Capacity: [39, 39, 40, 40, 40, 40, 40, 64], Money: [15, 15, 0, 0, 0, 0, 0, 0]
# Outgoing: 13:00, Return: 16:00, Capacity: [40, 40, 40, 40, 39, 40, 40, 63], Money: [0, 0, 0, 0, 15, 0, 0, 15]

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/lists/07_roasting_machine.py

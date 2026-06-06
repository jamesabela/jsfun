# World Cup Dream Manager - Level 11
# Tutorial: https://jamesabela.github.io/jsfun/worldcup_manager/11_load_country_data.html
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/malaysia.csv
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/malta.csv
#load https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/england.csv

# Your task: load a selected squad file and search for a player's statistics.

filename = input("Choose country file (malaysia.csv, malta.csv, england.csv): ")
search_player = input("Player to search for: ")

found = False

with open(filename, "r") as file:
    headings = file.readline()
    for line in file:
        parts = line.strip().split(",")
        name = parts[0]
        team_type = parts[1]
        position = parts[2]
        pace = parts[3]
        shooting = parts[4]
        passing = parts[5]
        defence = parts[6]
        stamina = parts[7]

        # TODO: if name matches search_player, set found to True and print their stats.
        # Format: [name] - [team_type] [position]: Pace [pace], Shooting [shooting], Passing [passing], Defence [defence], Stamina [stamina]
        pass

if found == False:
    print("Player not found")

#Input
# malaysia.csv
# Arif Aiman
# england.csv
# Harry Kane
# malta.csv
# Haley Bugeja
# england.csv
# Unknown Player

#output
# Arif Aiman - men Forward: Pace 84, Shooting 70, Passing 68, Defence 35, Stamina 72
# Harry Kane - men Forward: Pace 65, Shooting 93, Passing 84, Defence 48, Stamina 82
# Haley Bugeja - women Forward: Pace 82, Shooting 78, Passing 72, Defence 40, Stamina 76
# Player not found

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/12_build_your_world_cup.py

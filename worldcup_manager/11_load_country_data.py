# World Cup Dream Manager - Level 11
# Tutorial: https://jamesabela.github.io/jsfun/worldcup_manager/11_load_country_data.html
# Your task: load country data from countries.csv.

search_country = input("Country to search for: ")
team_type = input("women or men: ").lower()

found = False

with open("countries.csv") as file:
    headings = file.readline()
    for line in file:
        parts = line.strip().split(",")
        country = parts[0]
        region = parts[1]
        mens_rating = parts[2]
        womens_rating = parts[3]
        story = parts[4]

        # TODO: if country matches search_country, print the correct rating.
        # Women should use womens_rating. Men should use mens_rating.
        pass

if found == False:
    print("Country not found")

#Input
# Malaysia, women
# Malta, men
# Atlantis, women

#output
# Malaysia, AFC, 1280
# Malta, UEFA, 1000
# Country not found

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/worldcup_manager/12_build_your_world_cup.py

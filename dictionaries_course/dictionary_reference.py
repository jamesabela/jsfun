# Full dictionary reference playground
# This is not a level. It is a reference file for teachers and students.

capitals = {"USA":"Washington D.C.", "France":"Paris", "India":"New Delhi"}
example_d = {}
example_numNames = {1:"One", 2:"Two", 3:"Three"}
example_decNames = {1.5:"One and Half", 2.5:"Two and Half", 3.5:"Three and Half"}
example_items = {("Parker","Reynolds","Camlin"):"pen", ("LG","Whirlpool","Samsung"):"Refrigerator"}
example_romanNums = {'I':1, 'II':2, 'III':3, 'IV':4, 'V':5}
dict_obj = {"Fruit":["Mango","Banana"], "Color":["Blue", "Red"]}
numNames = {1:"One1", 2:"Two", 3:"Three", 2:"Two", 1:"One2"}

print(numNames)
print(type(numNames))
print(capitals.get("Japan", "Not found"))
for key in capitals:
    print("Key = " + key + ", Value = " + capitals[key])

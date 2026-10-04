logged_in_text = input("Logged in? True/False: ")
logged_in = logged_in_text == "True"
if not logged_in:
    print("Please log in")
else:
    print("Welcome")

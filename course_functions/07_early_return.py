# Tutorial: https://jamesabela.github.io/jsfun/course_functions/07_early_return.html
# Breadcrumb: Level 7 of 10 - Return Stops a Function
# Key terms: return statement, validation, selection, function

# Return ends the function immediately.

def age_group(age):
    if age < 0:
        # TODO: return Invalid
        pass

    if age >= 18:
        # TODO: return Adult
        pass

    return "Child"

print(age_group(-1))
print(age_group(20))
print(age_group(12))

#Input
# ""

#output
# Invalid, Adult, Child

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/course_functions/08_value_reference.py

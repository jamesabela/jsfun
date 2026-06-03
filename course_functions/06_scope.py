# Tutorial: https://jamesabela.github.io/jsfun/course_functions/06_scope.html
# Breadcrumb: Level 6 of 10 - Local Variables and Scope
# Key terms: local variable, global variable, scope, identifier

score = 10  # This is a global variable.

def add_bonus(start_score, bonus):
    # TODO: create a local variable called final_score
    # TODO: return final_score
    pass

new_score = add_bonus(score, 5)

print("Global score:", score)
print("New score:", new_score)

#Input
# ""

#output
# Global score:, 10, New score:, 15

#Next https://raw.githubusercontent.com/jamesabela/jsfun/refs/heads/main/course_functions/07_early_return.py

# Teachers Guide - Binary Trees Course

## Teacher notes

This course deliberately combines earlier topics. Students should open `skill_map.html` if they get stuck, because the course depends on recursion, OOP, list indexing and file handling.

## Level goals

1. Understand root, left child and right child.
2. Insert values into a list-based tree using data, left pointer and right pointer.
3. Search a list-based tree.
4. Use recursion for in-order traversal.
5. Draw a simple tree visually using turtle.
6. Create a Node class.
7. Insert recursively using OOP.
8. Search recursively using OOP.
9. Load words from a file.
10. Build a list-based binary tree from a file.
11. Build an OOP binary tree from a file.
12. Create a final word explorer project.

## Drop-in solution fragments

### Level 1
```python
left_child = 30
right_child = 70
```

### Level 2 right-side insertion
```python
if tree[current][2] == -1:
    tree.append([value, -1, -1])
    tree[current][2] = len(tree) - 1
    return
else:
    current = tree[current][2]
```

### Level 3 right search
```python
current = tree[current][2]
```

### Level 4 traversal
```python
inorder(tree[index][2])
```

### Level 5 turtle right child
```python
draw_line(0, 135, 80, 80)
draw_node(80, 80, "70")
```

### Level 6 right child
```python
root.right = Node(70)
```

### Level 7 right recursive case
```python
if current.right is None:
    current.right = Node(value)
else:
    self._insert_recursive(current.right, value)
```

### Level 8 right search
```python
return self._search(current.right, value)
```

### Level 9 append non-empty words
```python
if word != "":
    words.append(word)
```

### Level 10 insert word
```python
insert(word)
```

### Level 11 in-order traversal
```python
self._inorder(current.left)
print(current.data)
self._inorder(current.right)
```

### Level 12 project suggestion
Students should combine the final solution from Level 11 with user input for search and optionally write sorted output to a file.

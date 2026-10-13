// Editable starting points for the iGCSE Algorithms in pythoncopy.html.
// Prepared from igcse_algorithms.json using the Python visualiser's layout.
// Break statements connect to their enclosing loop's exit.
// Loaded as a local script so these templates also work from file://.
window.FLOWCHART_STARTERS = [
  {
    "id": "average",
    "title": "Average",
    "chart": {
      "version": 1,
      "title": "Average",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "student_marks = [85, 90, 78, 92, 88]",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "process",
          "text": "total = 0",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "process",
          "text": "number_of_values = len(student_marks)",
          "x": 180,
          "y": 611
        },
        {
          "id": "python-node-4",
          "type": "decision",
          "text": "for counter in range(number_of_values)",
          "x": 180,
          "y": 809
        },
        {
          "id": "python-node-5",
          "type": "process",
          "text": "total += student_marks[counter]",
          "x": 180,
          "y": 1007
        },
        {
          "id": "python-node-6",
          "type": "process",
          "text": "average = total / number_of_values",
          "x": 180,
          "y": 1259
        },
        {
          "id": "python-node-7",
          "type": "io",
          "text": "print(f\"Average: {average}\")",
          "x": 180,
          "y": 1439
        },
        {
          "id": "python-node-8",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1610
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-7",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-5",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-4",
          "to": "python-node-6",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "bubble-sort",
    "title": "Bubble Sort",
    "chart": {
      "version": 1,
      "title": "Bubble Sort",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "array = [64, 34, 25, 12, 22, 11, 90]",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "subroutine",
          "text": "bubble_sort(array)",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "io",
          "text": "print(\"Sorted array:\", array)",
          "x": 180,
          "y": 611
        },
        {
          "id": "python-node-4",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 782
        },
        {
          "id": "python-node-5",
          "type": "terminator",
          "text": "def bubble_sort()",
          "x": 792,
          "y": 80
        },
        {
          "id": "python-node-6",
          "type": "process",
          "text": "n = len(array)",
          "x": 792,
          "y": 251
        },
        {
          "id": "python-node-7",
          "type": "decision",
          "text": "for i in range(n)",
          "x": 792,
          "y": 449
        },
        {
          "id": "python-node-8",
          "type": "process",
          "text": "swap = False",
          "x": 792,
          "y": 647
        },
        {
          "id": "python-node-9",
          "type": "decision",
          "text": "for j in range(0, n-i-1)",
          "x": 792,
          "y": 845
        },
        {
          "id": "python-node-10",
          "type": "decision",
          "text": "array[j] > array[j+1]",
          "x": 792,
          "y": 1061
        },
        {
          "id": "python-node-11",
          "type": "process",
          "text": "array[j], array[j+1] = array[j+1], array[j]",
          "x": 792,
          "y": 1259
        },
        {
          "id": "python-node-12",
          "type": "process",
          "text": "swap = True",
          "x": 792,
          "y": 1439
        },
        {
          "id": "python-node-13",
          "type": "decision",
          "text": "not swap",
          "x": 792,
          "y": 1781
        },
        {
          "id": "python-node-15",
          "type": "terminator",
          "text": "RETURN",
          "x": 792,
          "y": 2294
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-13",
          "to": "python-node-15",
          "text": "True",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-13",
          "to": "python-node-7",
          "text": "False",
          "fromSide": "right",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-12",
          "to": "python-node-9",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-11",
          "to": "python-node-12",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-9",
          "from": "python-node-10",
          "to": "python-node-11",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-10",
          "from": "python-node-10",
          "to": "python-node-9",
          "text": "False",
          "fromSide": "right",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-11",
          "from": "python-node-9",
          "to": "python-node-10",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-12",
          "from": "python-node-9",
          "to": "python-node-13",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-13",
          "from": "python-node-8",
          "to": "python-node-9",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-14",
          "from": "python-node-7",
          "to": "python-node-8",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-15",
          "from": "python-node-7",
          "to": "python-node-15",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-16",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-17",
          "from": "python-node-5",
          "to": "python-node-6",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "counting",
    "title": "Counting",
    "chart": {
      "version": 1,
      "title": "Counting",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "pass_count = 0",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "process",
          "text": "loop_limit = 10",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "decision",
          "text": "for counter in range(1, loop_limit + 1)",
          "x": 180,
          "y": 629
        },
        {
          "id": "python-node-4",
          "type": "io",
          "text": "value = int(input(\"Enter a value: \"))",
          "x": 180,
          "y": 827
        },
        {
          "id": "python-node-5",
          "type": "decision",
          "text": "value > 5",
          "x": 180,
          "y": 1025
        },
        {
          "id": "python-node-6",
          "type": "process",
          "text": "pass_count += 1",
          "x": 180,
          "y": 1223
        },
        {
          "id": "python-node-7",
          "type": "io",
          "text": "print(f\"Pass count: {pass_count}\")",
          "x": 180,
          "y": 1547
        },
        {
          "id": "python-node-8",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1718
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-7",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-6",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-5",
          "to": "python-node-6",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-5",
          "to": "python-node-3",
          "text": "False",
          "fromSide": "right",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-3",
          "to": "python-node-7",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-9",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "for-loop",
    "title": "For Loop",
    "chart": {
      "version": 1,
      "title": "For Loop",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "decision",
          "text": "for counter in range(1, 11)",
          "x": 180,
          "y": 269
        },
        {
          "id": "python-node-2",
          "type": "io",
          "text": "print(counter)",
          "x": 180,
          "y": 467
        },
        {
          "id": "python-node-3",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 710
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-2",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-1",
          "to": "python-node-3",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "if-else",
    "title": "If Else",
    "chart": {
      "version": 1,
      "title": "If Else",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "condition1 = True",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "process",
          "text": "condition2 = False",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "decision",
          "text": "condition1",
          "x": 180,
          "y": 629
        },
        {
          "id": "python-node-4",
          "type": "io",
          "text": "print(\"Outcome for condition1 being True\")",
          "x": 180,
          "y": 827
        },
        {
          "id": "python-node-5",
          "type": "io",
          "text": "print(\"Outcome for condition1 being False\")",
          "x": 576,
          "y": 827
        },
        {
          "id": "python-node-6",
          "type": "decision",
          "text": "condition1 or condition2",
          "x": 180,
          "y": 1097
        },
        {
          "id": "python-node-7",
          "type": "io",
          "text": "print(\"Outcome for either condition1 or condition2 being True\")",
          "x": 180,
          "y": 1295
        },
        {
          "id": "python-node-8",
          "type": "io",
          "text": "print(\"Outcome for both condition1 and condition2 being False\")",
          "x": 576,
          "y": 1295
        },
        {
          "id": "python-node-9",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1538
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-7",
          "to": "python-node-9",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-8",
          "to": "python-node-9",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-6",
          "to": "python-node-8",
          "text": "False",
          "fromSide": "right",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-4",
          "to": "python-node-6",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-5",
          "to": "python-node-6",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-3",
          "to": "python-node-5",
          "text": "False",
          "fromSide": "right",
          "toSide": "top"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-9",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-10",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "linear-search",
    "title": "Linear Search",
    "chart": {
      "version": 1,
      "title": "Linear Search",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "array = [10, 20, 30, 40, 50]",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "subroutine",
          "text": "linear_search(array, 30)",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 602
        },
        {
          "id": "python-node-4",
          "type": "terminator",
          "text": "def linear_search()",
          "x": 720,
          "y": 80
        },
        {
          "id": "python-node-5",
          "type": "process",
          "text": "found = False",
          "x": 720,
          "y": 251
        },
        {
          "id": "python-node-6",
          "type": "process",
          "text": "counter = 0",
          "x": 720,
          "y": 431
        },
        {
          "id": "python-node-7",
          "type": "process",
          "text": "number_of_values = len(array)",
          "x": 720,
          "y": 611
        },
        {
          "id": "python-node-8",
          "type": "decision",
          "text": "while not found and counter < number_of_values",
          "x": 720,
          "y": 809
        },
        {
          "id": "python-node-9",
          "type": "decision",
          "text": "array[counter] == value",
          "x": 720,
          "y": 1025
        },
        {
          "id": "python-node-10",
          "type": "process",
          "text": "found = True",
          "x": 720,
          "y": 1223
        },
        {
          "id": "python-node-11",
          "type": "process",
          "text": "counter += 1",
          "x": 1116,
          "y": 1223
        },
        {
          "id": "python-node-12",
          "type": "decision",
          "text": "found",
          "x": 720,
          "y": 1565
        },
        {
          "id": "python-node-13",
          "type": "io",
          "text": "print(f\"{value} found at position {counter} in the list.\")",
          "x": 720,
          "y": 1763
        },
        {
          "id": "python-node-14",
          "type": "io",
          "text": "print(f\"{value} not found.\")",
          "x": 1116,
          "y": 1763
        },
        {
          "id": "python-node-15",
          "type": "terminator",
          "text": "RETURN",
          "x": 720,
          "y": 2006
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-13",
          "to": "python-node-15",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-12",
          "to": "python-node-13",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-14",
          "to": "python-node-15",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-12",
          "to": "python-node-14",
          "text": "False",
          "fromSide": "right",
          "toSide": "top"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-10",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-9",
          "to": "python-node-10",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-9",
          "from": "python-node-11",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-10",
          "from": "python-node-9",
          "to": "python-node-11",
          "text": "False",
          "fromSide": "right",
          "toSide": "top"
        },
        {
          "id": "python-edge-11",
          "from": "python-node-8",
          "to": "python-node-9",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-12",
          "from": "python-node-8",
          "to": "python-node-12",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-13",
          "from": "python-node-7",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-14",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-15",
          "from": "python-node-5",
          "to": "python-node-6",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-16",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "maximum-and-minimum",
    "title": "Maximum and Minimum",
    "chart": {
      "version": 1,
      "title": "Maximum and Minimum",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "array = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5]",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "process",
          "text": "maximum_value = array[0]",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "process",
          "text": "minimum_value = array[0]",
          "x": 180,
          "y": 611
        },
        {
          "id": "python-node-4",
          "type": "process",
          "text": "loop_limit = len(array)",
          "x": 180,
          "y": 791
        },
        {
          "id": "python-node-5",
          "type": "decision",
          "text": "for counter in range(1, loop_limit)",
          "x": 180,
          "y": 989
        },
        {
          "id": "python-node-6",
          "type": "decision",
          "text": "array[counter] > maximum_value",
          "x": 180,
          "y": 1205
        },
        {
          "id": "python-node-7",
          "type": "process",
          "text": "maximum_value = array[counter]",
          "x": 180,
          "y": 1403
        },
        {
          "id": "python-node-8",
          "type": "decision",
          "text": "array[counter] < minimum_value",
          "x": 180,
          "y": 1673
        },
        {
          "id": "python-node-9",
          "type": "process",
          "text": "minimum_value = array[counter]",
          "x": 180,
          "y": 1871
        },
        {
          "id": "python-node-10",
          "type": "io",
          "text": "print(f\"Maximum value: {maximum_value}\")",
          "x": 180,
          "y": 2195
        },
        {
          "id": "python-node-11",
          "type": "io",
          "text": "print(f\"Minimum value: {minimum_value}\")",
          "x": 180,
          "y": 2375
        },
        {
          "id": "python-node-12",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 2546
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-11",
          "to": "python-node-12",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-10",
          "to": "python-node-11",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-9",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-8",
          "to": "python-node-9",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-8",
          "to": "python-node-5",
          "text": "False",
          "fromSide": "right",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-7",
          "to": "python-node-8",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-6",
          "to": "python-node-8",
          "text": "False",
          "fromSide": "right",
          "toSide": "top"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-5",
          "to": "python-node-6",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-9",
          "from": "python-node-5",
          "to": "python-node-10",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-10",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-11",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-12",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-13",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-14",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "repeat-until",
    "title": "Repeat Until",
    "chart": {
      "version": 1,
      "title": "Repeat Until",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "counter = 1",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "decision",
          "text": "while True",
          "x": 180,
          "y": 449
        },
        {
          "id": "python-node-3",
          "type": "io",
          "text": "print(counter)",
          "x": 180,
          "y": 647
        },
        {
          "id": "python-node-4",
          "type": "process",
          "text": "counter += 1",
          "x": 180,
          "y": 827
        },
        {
          "id": "python-node-5",
          "type": "decision",
          "text": "counter > 10",
          "x": 180,
          "y": 1025
        },
        {
          "id": "python-node-7",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1538
        }
      ],
      "edges": [
        {
          "id": "python-edge-1",
          "from": "python-node-5",
          "to": "python-node-7",
          "text": "True",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-5",
          "to": "python-node-2",
          "text": "False",
          "fromSide": "right",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-2",
          "to": "python-node-7",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-8",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "totalling",
    "title": "Totalling",
    "chart": {
      "version": 1,
      "title": "Totalling",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "total = 0",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "process",
          "text": "loop_limit = 10",
          "x": 180,
          "y": 431
        },
        {
          "id": "python-node-3",
          "type": "decision",
          "text": "for counter in range(1, loop_limit + 1)",
          "x": 180,
          "y": 629
        },
        {
          "id": "python-node-4",
          "type": "process",
          "text": "value_to_be_totalled = counter",
          "x": 180,
          "y": 827
        },
        {
          "id": "python-node-5",
          "type": "process",
          "text": "total += value_to_be_totalled",
          "x": 180,
          "y": 1007
        },
        {
          "id": "python-node-6",
          "type": "io",
          "text": "print(f\"Total: {total}\")",
          "x": 180,
          "y": 1259
        },
        {
          "id": "python-node-7",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1430
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-6",
          "to": "python-node-7",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-5",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-4",
          "to": "python-node-5",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-3",
          "to": "python-node-6",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-6",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-7",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  },
  {
    "id": "while-loop",
    "title": "While Loop",
    "chart": {
      "version": 1,
      "title": "While Loop",
      "nodes": [
        {
          "id": "python-node-0",
          "type": "terminator",
          "text": "START",
          "x": 180,
          "y": 80
        },
        {
          "id": "python-node-1",
          "type": "process",
          "text": "counter = 1",
          "x": 180,
          "y": 251
        },
        {
          "id": "python-node-2",
          "type": "decision",
          "text": "while counter <= 10",
          "x": 180,
          "y": 449
        },
        {
          "id": "python-node-3",
          "type": "io",
          "text": "print(counter)",
          "x": 180,
          "y": 647
        },
        {
          "id": "python-node-4",
          "type": "process",
          "text": "counter += 1",
          "x": 180,
          "y": 827
        },
        {
          "id": "python-node-5",
          "type": "terminator",
          "text": "END",
          "x": 180,
          "y": 1070
        }
      ],
      "edges": [
        {
          "id": "python-edge-0",
          "from": "python-node-4",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "left",
          "via": "left"
        },
        {
          "id": "python-edge-1",
          "from": "python-node-3",
          "to": "python-node-4",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-2",
          "from": "python-node-2",
          "to": "python-node-3",
          "text": "True",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-3",
          "from": "python-node-2",
          "to": "python-node-5",
          "text": "False",
          "fromSide": "right",
          "toSide": "top",
          "via": "right"
        },
        {
          "id": "python-edge-4",
          "from": "python-node-1",
          "to": "python-node-2",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        },
        {
          "id": "python-edge-5",
          "from": "python-node-0",
          "to": "python-node-1",
          "text": "",
          "fromSide": "bottom",
          "toSide": "top"
        }
      ]
    }
  }
];

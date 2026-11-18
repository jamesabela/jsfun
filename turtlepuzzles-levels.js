/**
 * Turtle Quest - 40 Data-Driven Levels across 5 Worlds
 * Works in both Browser (window.TurtleLevels) and Node.js (module.exports).
 */
(function (root, factory) {
  if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.TurtleLevels = factory();
  }
}(typeof self !== 'undefined' ? self : this, function () {
  'use strict';

  const WORLDS = [
    {
      id: 1,
      name: 'Turtle Training',
      theme: 'training',
      subtitle: 'Training Grounds',
      description: 'Learn sequencing, movement, turns, and debugging.',
      badge: '🏕️',
      image: 'images/turtlequest/world1-training.jpg',
      unlockLevel: 1,
      intro: {
        title: 'Welcome to Turtle Training!',
        body: 'Press the command buttons to write real Python code. Move your turtle to the finish flag, avoid walls, and collect any gems along the way!',
        demoCode: 'import turtle\n\nturtle.forward(40)\nturtle.left(90)\nturtle.forward(40)'
      }
    },
    {
      id: 2,
      name: 'The Loop Forest',
      theme: 'forest',
      subtitle: 'Woodland Environment',
      description: 'Master count-controlled loops to make your programs shorter.',
      badge: '🌲',
      image: 'images/turtlequest/world2-forest.jpg',
      unlockLevel: 9,
      intro: {
        title: 'New Command Unlocked: Repeat Loops!',
        body: 'Instead of repeating the same commands over and over, press 🔁 Repeat to wrap commands inside a Python for-loop. Press ↵ End repeat when the loop body is finished.',
        demoCode: 'import turtle\n\nfor i in range(4):\n    turtle.forward(40)'
      }
    },
    {
      id: 3,
      name: 'The Art Academy',
      theme: 'studio',
      subtitle: 'Colourful Drawing Studio',
      description: 'Explore angles, pen control, and colours to draw shapes.',
      badge: '🎨',
      image: 'images/turtlequest/world3-studio.jpg',
      unlockLevel: 17,
      intro: {
        title: 'New Tools: Angles, Pen Control & Colours!',
        body: 'You can now choose custom turning angles and distances, lift the pen with Pen up / Pen down, and change pen colours! Follow the faint dashed guide on the canvas.',
        demoCode: 'import turtle\n\nturtle.pencolor("purple")\nfor i in range(3):\n    turtle.forward(80)\n    turtle.left(120)'
      }
    },
    {
      id: 4,
      name: 'The Crystal Caves',
      theme: 'caves',
      subtitle: 'Underground Crystal Caverns',
      description: 'Combine nested loops for patterns and complex mazes.',
      badge: '💎',
      image: 'images/turtlequest/world4-caves.jpg',
      unlockLevel: 25,
      intro: {
        title: 'New Technique: Nested Loops!',
        body: 'You can place a Repeat loop inside another Repeat loop! Python automatically uses a new loop variable (like j) for the inner loop.',
        demoCode: 'import turtle\n\nfor i in range(4):\n    for j in range(4):\n        turtle.forward(40)\n        turtle.right(90)\n    turtle.right(90)'
      }
    },
    {
      id: 5,
      name: 'The Algorithm Kingdom',
      theme: 'kingdom',
      subtitle: 'Futuristic Castle',
      description: 'Build reusable functions and combine everything you know.',
      badge: '🏰',
      image: 'images/turtlequest/world5-kingdom.jpg',
      unlockLevel: 33,
      intro: {
        title: 'New Power: Functions & Text Mode!',
        body: 'Press 🧩 Define function to package a reusable sequence of commands, ↵ End function when done, and ▶️ Call function whenever you need it. You can also toggle Text Mode to type Python directly!',
        demoCode: 'import turtle\n\ndef square():\n    for i in range(4):\n        turtle.forward(40)\n        turtle.right(90)\n\nsquare()'
      }
    }
  ];

  // Helper to build target drawing segments from a declarative path script
  function traceTarget(startX, startY, startHeading, actions) {
    let x = startX;
    let y = startY;
    let h = startHeading;
    let down = true;
    let color = 'blue';
    const segs = [];

    for (let i = 0; i < actions.length; i++) {
      const a = actions[i];
      if (a[0] === 'f') {
        const rad = (h * Math.PI) / 180;
        const nx = x + a[1] * Math.cos(rad);
        const ny = y + a[1] * Math.sin(rad);
        if (down) segs.push({ x1: x, y1: y, x2: nx, y2: ny, color });
        x = nx; y = ny;
      } else if (a[0] === 'b') {
        const rad = (h * Math.PI) / 180;
        const nx = x - a[1] * Math.cos(rad);
        const ny = y - a[1] * Math.sin(rad);
        if (down) segs.push({ x1: x, y1: y, x2: nx, y2: ny, color });
        x = nx; y = ny;
      } else if (a[0] === 'l') {
        h = ((h + a[1]) % 360 + 360) % 360;
      } else if (a[0] === 'r') {
        h = ((h - a[1]) % 360 + 360) % 360;
      } else if (a[0] === 'pu') {
        down = false;
      } else if (a[0] === 'pd') {
        down = true;
      } else if (a[0] === 'c') {
        color = a[1];
      }
    }
    return segs;
  }

  function repeatActions(count, fn) {
    const out = [];
    for (let i = 0; i < count; i++) out.push(...fn(i));
    return out;
  }

  // Helper to build wall rectangles from a 12x12 grid of '#' (wall) and '.' (open)
  // Cell (col, row) where col 0..11 (left to right), row 0..11 (top to bottom).
  // Cell center in turtle coords: x = -220 + col * 40, y = 220 - row * 40.
  // Wall rect spans [centerX - 20, centerX + 20] x [centerY - 20, centerY + 20].
  function gridWalls(rows) {
    const walls = [];
    for (let r = 0; r < rows.length; r++) {
      const row = rows[r];
      for (let c = 0; c < row.length; c++) {
        if (row[c] === '#') {
          walls.push({
            x: -240 + c * 40,
            y: 200 - r * 40,
            w: 40,
            h: 40
          });
        }
      }
    }
    return walls;
  }

  function cellCenter(col, row) {
    return { x: -220 + col * 40, y: 220 - row * 40 };
  }

  const CMDS_W1 = ['forward', 'backward', 'left', 'right'];
  const CMDS_W2 = ['forward', 'backward', 'left', 'right', 'repeat', 'end_repeat'];
  const CMDS_W3 = ['forward', 'backward', 'left', 'right', 'repeat', 'end_repeat', 'pendown', 'penup', 'color'];
  const CMDS_W4 = CMDS_W3;
  const CMDS_W5 = [...CMDS_W4, 'def_fn', 'end_fn', 'call_fn'];

  const LEVELS = [
    // ==================== WORLD 1: TURTLE TRAINING (1-8) ====================
    {
      id: 1,
      world: 1,
      title: 'First Steps',
      type: 'maze',
      objective: 'Move forward to reach the flag.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(3, 6), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(6, 6),
      gems: [],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '##........##',
        '##........##',
        '##........##',
        '############',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'Count how many grid squares separate your turtle from the flag.',
        'Each Forward command moves the turtle 40 steps (one square).',
        'turtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)'
      ],
      referenceSolution: 'import turtle\n\nturtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)'
    },
    {
      id: 2,
      world: 1,
      title: 'Around the Corner',
      type: 'maze',
      objective: 'Navigate a single left-hand corner.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(3, 7), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(6, 4),
      gems: [],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '#####...####',
        '#####...####',
        '#####...####',
        '##......####',
        '##......####',
        '############',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 8,
      threeStarLines: 7,
      hints: [
        'Move forward to the corner, then turn left to face upward.',
        'Use Forward 3 times, Turn left once, then Forward 3 times.',
        'turtle.forward(40)\n...\nturtle.left(90)\nturtle.forward(40)'
      ],
      referenceSolution: 'import turtle\n\nturtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)\nturtle.left(90)\nturtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)'
    },
    {
      id: 3,
      world: 1,
      title: 'The Other Way',
      type: 'maze',
      objective: 'Navigate a right-hand corner.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(3, 4), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(6, 7),
      gems: [],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '##......####',
        '##......####',
        '#####...####',
        '#####...####',
        '#####...####',
        '#####...####',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 8,
      threeStarLines: 7,
      hints: [
        'This time the path goes down after the corner.',
        'Use Turn right (turtle.right(90)) when you reach the corner.',
        'turtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)\nturtle.right(90)'
      ],
      referenceSolution: 'import turtle\n\nturtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)\nturtle.right(90)\nturtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)'
    },
    {
      id: 4,
      world: 1,
      title: 'Treasure Trail',
      type: 'maze',
      objective: 'Collect three gems along a winding path.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 7), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(8, 3),
      gems: [cellCenter(5, 7), cellCenter(5, 5), cellCenter(8, 5)],
      walls: gridWalls([
        '############',
        '############',
        '#######...##',
        '#######...##',
        '####......##',
        '####......##',
        '#.....######',
        '#.....######',
        '#.....######',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 14,
      threeStarLines: 13,
      hints: [
        'Follow the path: right to the first gem, up to the second, right to the third, then up to the flag.',
        'You will need 3 turns: left, right, and left.',
        'turtle.left(90)\nturtle.forward(40)\nturtle.forward(40)\nturtle.right(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)',
        'turtle.forward(40)'
      ].join('\n')
    },
    {
      id: 5,
      world: 1,
      title: 'Reverse Gear',
      type: 'maze',
      objective: 'Move backwards out of a dead end.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(6, 5), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(4, 8),
      gems: [cellCenter(4, 5)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '###....#####',
        '###....#####',
        '###..#######',
        '###..#######',
        '###..#######',
        '###..#######',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 8,
      threeStarLines: 6,
      hints: [
        'There is a wall right in front of your turtle! Can you back up without turning around?',
        'Use Backward twice to collect the gem, then turn left (or right) to face the flag.',
        'turtle.backward(40)\nturtle.backward(40)\nturtle.right(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.backward(40)',
        'turtle.backward(40)',
        'turtle.right(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.forward(40)'
      ].join('\n')
    },
    {
      id: 6,
      world: 1,
      title: 'Zigzag',
      type: 'maze',
      objective: 'Navigate a corridor with alternating turns.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 8), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(6, 4),
      gems: [cellCenter(4, 6)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '######.#####',
        '######.#####',
        '####...#####',
        '####.#######',
        '##...#######',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 14,
      threeStarLines: 12,
      hints: [
        'Move 2 squares, turn left, move 2 squares, turn right — and repeat that pattern!',
        'Alternate between turtle.left(90) and turtle.right(90).',
        'turtle.forward(40)\nturtle.forward(40)\nturtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.right(90)'
      ].join('\n')
    },
    {
      id: 7,
      world: 1,
      title: 'Choose Your Route',
      type: 'maze',
      objective: 'Find the shortest route through a maze.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 6), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(7, 6),
      gems: [cellCenter(5, 4)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '####....####',
        '####.##.####',
        '#....#...###',
        '#.######.###',
        '#..........#',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 14,
      threeStarLines: 12,
      hints: [
        'The bottom route is longer and misses the gem! Look at the upper path.',
        'Go right 2 squares, up 2 squares to grab the gem, right 3 squares, then down 2 squares.',
        'turtle.forward(40)\nturtle.forward(40)\nturtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(40)',
        'turtle.forward(40)'
      ].join('\n')
    },
    {
      id: 8,
      world: 1,
      title: 'The Great Escape',
      type: 'maze',
      objective: 'Complete a larger maze using all the movement commands.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 9), heading: 0, penDown: true, color: 'blue' },
      flag: cellCenter(9, 2),
      gems: [cellCenter(5, 9), cellCenter(5, 5), cellCenter(9, 5)],
      walls: gridWalls([
        '############',
        '#########.##',
        '#########.##',
        '#########.##',
        '#########.##',
        '#####.....##',
        '#####.######',
        '#####.######',
        '#####.######',
        '##....######',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W1,
      allowedParams: { distances: [40], angles: [90] },
      targetLines: 19,
      threeStarLines: 17,
      hints: [
        'Break the maze into four straight legs, collecting each gem on the way.',
        'Leg 1: 3 right. Leg 2: 4 up. Leg 3: 4 right. Leg 4: 3 up.',
        'turtle.forward(40)\nturtle.forward(40)\nturtle.forward(40)\nturtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(40)', 'turtle.forward(40)', 'turtle.forward(40)'
      ].join('\n')
    },

    // ==================== WORLD 2: THE LOOP FOREST (9-16) ====================
    {
      id: 9,
      world: 2,
      title: 'Walking the Line',
      type: 'maze',
      objective: 'Replace repeated forward commands with a loop.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 6), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(9, 6),
      gems: [cellCenter(5, 6), cellCenter(7, 6)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '#..........#',
        '#..........#',
        '#..........#',
        '############',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6, 7, 8] },
      targetLines: 4,
      threeStarLines: 2,
      hints: [
        'How many steps forward do you need to reach the flag? Can a loop do them all in 2 lines?',
        'Press 🔁 Repeat, choose 7, then press ⬆️ Forward.',
        'for i in range(7):\n    turtle.forward(40)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(7):\n    turtle.forward(40)'
    },
    {
      id: 10,
      world: 2,
      title: 'Staircase',
      type: 'maze',
      objective: 'Repeat a movement pattern through a staircase-shaped maze.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 9), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(7, 4),
      gems: [cellCenter(3, 8), cellCenter(5, 6)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '######...###',
        '######...###',
        '#####...####',
        '####...#####',
        '###...######',
        '##...#######',
        '#...########',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'Each stair step is: forward, turn left, forward, turn right.',
        'Repeat that 4-command stair pattern 5 times!',
        'for i in range(5):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(40)\n    turtle.right(90)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(5):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(40)\n    turtle.right(90)'
    },
    {
      id: 11,
      world: 2,
      title: 'A Square Deal',
      type: 'maze',
      objective: 'Travel around a square using iteration.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(3, 8), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(3, 8),
      gems: [cellCenter(7, 8), cellCenter(7, 4), cellCenter(3, 4)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '##.......###',
        '##.......###',
        '##..###..###',
        '##..###..###',
        '##.......###',
        '##.......###',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6] },
      targetLines: 8,
      threeStarLines: 6,
      hints: [
        'Each side of the square is 4 steps long, followed by a left turn.',
        'You can put a loop of 4 forward steps inside a loop of 4 sides — or 4 forwards + 1 left inside range(4)!',
        'for i in range(4):\n    for j in range(4):\n        turtle.forward(40)\n    turtle.left(90)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(4):\n    for j in range(4):\n        turtle.forward(40)\n    turtle.left(90)'
    },
    {
      id: 12,
      world: 2,
      title: 'The Repeating Trail',
      type: 'maze',
      objective: 'Follow a corridor containing repeated turns.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 8), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(9, 8),
      gems: [cellCenter(3, 6), cellCenter(7, 6)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '############',
        '###...#...##',
        '###.#.#.#.##',
        '#...#...#..#',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5] },
      targetLines: 15,
      threeStarLines: 13,
      hints: [
        'Notice the arch shape repeats twice: right 2, up 2, right 2, down 2!',
        'Wrap one full arch inside `for i in range(2):`.',
        'for i in range(2):\n    turtle.forward(40)\n    turtle.forward(40)\n    turtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(2):',
        '    turtle.forward(40)',
        '    turtle.forward(40)',
        '    turtle.left(90)',
        '    turtle.forward(40)',
        '    turtle.forward(40)',
        '    turtle.right(90)',
        '    turtle.forward(40)',
        '    turtle.forward(40)',
        '    turtle.right(90)',
        '    turtle.forward(40)',
        '    turtle.forward(40)',
        '    turtle.left(90)'
      ].join('\n')
    },
    {
      id: 13,
      world: 2,
      title: 'Stepping Stones',
      type: 'maze',
      objective: 'Collect gems placed at regular intervals along a repeating path.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 5), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(9, 5),
      gems: [cellCenter(3, 5), cellCenter(5, 5), cellCenter(7, 5)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '#..........#',
        '#..........#',
        '#..........#',
        '############',
        '############',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6, 8] },
      targetLines: 4,
      threeStarLines: 2,
      hints: [
        'The gems are every 2 steps, 8 steps total to the flag.',
        'A single loop of 8 forward steps collects every gem and reaches the flag!',
        'for i in range(8):\n    turtle.forward(40)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(8):\n    turtle.forward(40)'
    },
    {
      id: 14,
      world: 2,
      title: 'Zigzag Again',
      type: 'maze',
      objective: 'Repeat a four-command zigzag pattern.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 9), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(8, 3),
      gems: [cellCenter(4, 7), cellCenter(6, 5)],
      walls: gridWalls([
        '############',
        '############',
        '#######...##',
        '#######...##',
        '######...###',
        '#####...####',
        '####...#####',
        '###...######',
        '##...#######',
        '#...########',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'Count how many times the 4-command zigzag repeats to reach the flag.',
        'Forward, left, forward, right — repeated 6 times!',
        'for i in range(6):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(40)\n    turtle.right(90)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(6):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(40)\n    turtle.right(90)'
    },
    {
      id: 15,
      world: 2,
      title: 'The Long Road',
      type: 'maze',
      objective: 'Complete a lengthy repeating maze within a small line limit.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 2), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(1, 8),
      gems: [cellCenter(9, 2), cellCenter(9, 8)],
      walls: gridWalls([
        '############',
        '############',
        '#.........##',
        '#.#######.##',
        '#.#######.##',
        '#.#######.##',
        '#.#######.##',
        '#.#######.##',
        '#.........##',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [3, 4, 6, 8] },
      targetLines: 10,
      threeStarLines: 8,
      hints: [
        'Notice the path goes right 8, down 6, left 8 — three straight segments.',
        'Use three loops: range(8), then turn right, range(6), then turn right, range(8).',
        'for i in range(8):\n    turtle.forward(40)\nturtle.right(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(8):',
        '    turtle.forward(40)',
        'turtle.right(90)',
        'for i in range(6):',
        '    turtle.forward(40)',
        'turtle.right(90)',
        'for i in range(8):',
        '    turtle.forward(40)'
      ].join('\n')
    },
    {
      id: 16,
      world: 2,
      title: 'Forest Guardian',
      type: 'maze',
      objective: 'Combine repeated sequences and individual commands to escape a complex maze.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 9), heading: 0, penDown: true, color: 'green' },
      flag: cellCenter(9, 1),
      gems: [cellCenter(5, 9), cellCenter(5, 5), cellCenter(9, 5)],
      walls: gridWalls([
        '############',
        '#########.##',
        '#########.##',
        '#########.##',
        '#########.##',
        '#####.....##',
        '#####.######',
        '#####.######',
        '#####.######',
        '#.....######',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W2,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4] },
      targetLines: 13,
      threeStarLines: 11,
      hints: [
        'There are 4 straight segments of length 4 separated by turns!',
        'Each segment can be a loop of 4 forward steps, with a turn between them.',
        'for i in range(4):\n    turtle.forward(40)\nturtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(4):',
        '    turtle.forward(40)',
        'turtle.left(90)',
        'for i in range(4):',
        '    turtle.forward(40)',
        'turtle.right(90)',
        'for i in range(4):',
        '    turtle.forward(40)',
        'turtle.left(90)',
        'for i in range(4):',
        '    turtle.forward(40)'
      ].join('\n')
    },

    // ==================== WORLD 3: THE ART ACADEMY (17-24) ====================
    {
      id: 17,
      world: 3,
      title: 'Draw a Square',
      type: 'drawing',
      objective: 'Draw a square using iteration.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -60, y: -60, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-60, -60, 0, repeatActions(4, () => [['f', 120], ['l', 90]])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 80, 120], angles: [45, 60, 90, 120], repeats: [3, 4, 5, 6, 8], colors: ['blue', 'red', 'green', 'purple'] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'A square has 4 equal sides of length 120 and 4 turns of 90 degrees.',
        'Use Repeat 4 with Forward 120 and Turn left 90.',
        'for i in range(4):\n    turtle.forward(120)\n    turtle.left(90)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(4):\n    turtle.forward(120)\n    turtle.left(90)'
    },
    {
      id: 18,
      world: 3,
      title: 'The Triangle',
      type: 'drawing',
      objective: 'Discover the correct turning angle for an equilateral triangle.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -60, y: -50, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-60, -50, 0, repeatActions(3, () => [['f', 120], ['l', 120]])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 80, 120], angles: [60, 90, 120], repeats: [3, 4, 6], colors: ['blue', 'red', 'green', 'purple'] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'A full turn is 360 degrees. Divide 360 by 3 sides to find the exterior turning angle!',
        'The turtle needs to turn 120 degrees (not 60!) at each corner.',
        'for i in range(3):\n    turtle.forward(120)\n    turtle.left(120)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(3):\n    turtle.forward(120)\n    turtle.left(120)'
    },
    {
      id: 19,
      world: 3,
      title: 'Hexagon Island',
      type: 'drawing',
      objective: 'Draw a regular hexagon.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -40, y: -70, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-40, -70, 0, repeatActions(6, () => [['f', 80], ['l', 60]])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 80, 120], angles: [45, 60, 90, 120], repeats: [4, 5, 6, 8], colors: ['blue', 'red', 'green', 'purple'] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'A hexagon has 6 equal sides. What is 360 divided by 6?',
        'Repeat 6 times: Forward 80, Turn left 60.',
        'for i in range(6):\n    turtle.forward(80)\n    turtle.left(60)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(6):\n    turtle.forward(80)\n    turtle.left(60)'
    },
    {
      id: 20,
      world: 3,
      title: 'Reach for the Stars',
      type: 'drawing',
      objective: 'Draw a five-pointed star.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -70, y: 20, heading: 0, penDown: true, color: 'gold' },
      targetDrawing: traceTarget(-70, 20, 0, repeatActions(5, () => [['f', 140], ['r', 144]])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [80, 120, 140], angles: [72, 108, 144], repeats: [5, 6], colors: ['gold', 'blue', 'purple', 'red'] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'A 5-pointed star turns twice as sharply as a pentagon: 2 × (360 / 5) = 144 degrees!',
        'Repeat 5 times: Forward 140, Turn right 144.',
        'for i in range(5):\n    turtle.forward(140)\n    turtle.right(144)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(5):\n    turtle.forward(140)\n    turtle.right(144)'
    },
    {
      id: 21,
      world: 3,
      title: 'Colour Splash',
      type: 'drawing',
      objective: 'Complete a drawing using specified colours.',
      requireColors: true,
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -60, y: -60, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-60, -60, 0, [
        ['c', 'red'], ['f', 120], ['l', 90],
        ['c', 'blue'], ['f', 120], ['l', 90],
        ['c', 'green'], ['f', 120], ['l', 90],
        ['c', 'purple'], ['f', 120], ['l', 90]
      ]),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 80, 120], angles: [90], repeats: [2, 4], colors: ['red', 'blue', 'green', 'purple'] },
      targetLines: 13,
      threeStarLines: 12,
      hints: [
        'Look at the colour of each side of the dashed square: red, blue, green, purple.',
        'Set turtle.pencolor(...) before drawing each side!',
        'turtle.pencolor("red")\nturtle.forward(120)\nturtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.pencolor("red")',
        'turtle.forward(120)',
        'turtle.left(90)',
        'turtle.pencolor("blue")',
        'turtle.forward(120)',
        'turtle.left(90)',
        'turtle.pencolor("green")',
        'turtle.forward(120)',
        'turtle.left(90)',
        'turtle.pencolor("purple")',
        'turtle.forward(120)',
        'turtle.left(90)'
      ].join('\n')
    },
    {
      id: 22,
      world: 3,
      title: 'Invisible Ink',
      type: 'drawing',
      objective: 'Use pen up and pen down to draw two separate shapes.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -120, y: -40, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-120, -40, 0, [
        ...repeatActions(4, () => [['f', 80], ['l', 90]]),
        ['pu'], ['f', 160], ['pd'],
        ...repeatActions(4, () => [['f', 80], ['l', 90]])
      ]),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 80, 120, 160], angles: [90], repeats: [4], colors: ['blue', 'purple', 'teal'] },
      targetLines: 11,
      threeStarLines: 9,
      hints: [
        'Draw the first 80×80 square, lift the pen, move 160 steps right, put the pen down, and draw the second square.',
        'Use turtle.penup() before moving to the second square, then turtle.pendown().',
        'turtle.penup()\nturtle.forward(160)\nturtle.pendown()'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(4):',
        '    turtle.forward(80)',
        '    turtle.left(90)',
        'turtle.penup()',
        'turtle.forward(160)',
        'turtle.pendown()',
        'for i in range(4):',
        '    turtle.forward(80)',
        '    turtle.left(90)'
      ].join('\n')
    },
    {
      id: 23,
      world: 3,
      title: 'The Octagon',
      type: 'drawing',
      objective: 'Draw an octagon using iteration.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -30, y: -80, heading: 0, penDown: true, color: 'teal' },
      targetDrawing: traceTarget(-30, -80, 0, repeatActions(8, () => [['f', 60], ['l', 45]])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 60, 80], angles: [45, 60, 90], repeats: [6, 8], colors: ['teal', 'blue', 'purple'] },
      targetLines: 4,
      threeStarLines: 3,
      hints: [
        'An octagon has 8 sides. What is 360 divided by 8?',
        'Repeat 8 times: Forward 60, Turn left 45.',
        'for i in range(8):\n    turtle.forward(60)\n    turtle.left(45)'
      ],
      referenceSolution: 'import turtle\n\nfor i in range(8):\n    turtle.forward(60)\n    turtle.left(45)'
    },
    {
      id: 24,
      world: 3,
      title: 'Flower Power',
      type: 'drawing',
      objective: 'Draw a geometric flower using repeated shapes.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'purple' },
      targetDrawing: traceTarget(0, 0, 0, repeatActions(6, () => [
        ...repeatActions(4, () => [['f', 60], ['l', 90]]),
        ['l', 60]
      ])),
      availableCommands: CMDS_W3,
      allowedParams: { distances: [40, 60, 80], angles: [45, 60, 90], repeats: [4, 6, 8], colors: ['purple', 'pink', 'blue'] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'The flower is made of 6 squares rotated by 60 degrees around the centre.',
        'Put a square loop (range(4)) inside an outer loop (range(6)), with a 60° turn after each square!',
        'for i in range(6):\n    for j in range(4):\n        turtle.forward(60)\n        turtle.left(90)\n    turtle.left(60)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(6):',
        '    for j in range(4):',
        '        turtle.forward(60)',
        '        turtle.left(90)',
        '    turtle.left(60)'
      ].join('\n')
    },

    // ==================== WORLD 4: THE CRYSTAL CAVES (25-32) ====================
    {
      id: 25,
      world: 4,
      title: 'Double Trouble',
      type: 'maze',
      objective: 'Use two separate loops to complete two repeating paths.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 8), heading: 0, penDown: true, color: 'cyan' },
      flag: cellCenter(6, 2),
      gems: [cellCenter(6, 8), cellCenter(6, 5)],
      walls: gridWalls([
        '############',
        '#####...####',
        '#####...####',
        '#####...####',
        '#####...####',
        '#####...####',
        '#####...####',
        '#.......####',
        '#.......####',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 3, 4, 5, 6] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'Walk 4 steps right, turn left, then walk 6 steps up.',
        'Use one loop for the horizontal path and a second loop for the vertical path.',
        'for i in range(4):\n    turtle.forward(40)\nturtle.left(90)\nfor i in range(6):\n    turtle.forward(40)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(4):',
        '    turtle.forward(40)',
        'turtle.left(90)',
        'for i in range(6):',
        '    turtle.forward(40)'
      ].join('\n')
    },
    {
      id: 26,
      world: 4,
      title: 'Square Within a Square',
      type: 'drawing',
      objective: 'Draw a pattern of squares using nested loops.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'cyan' },
      targetDrawing: traceTarget(0, 0, 0, repeatActions(4, () => [
        ...repeatActions(4, () => [['f', 80], ['l', 90]]),
        ['l', 90]
      ])),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40, 80, 120], angles: [45, 90], repeats: [4, 8], colors: ['cyan', 'blue', 'purple'] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'Draw 4 squares of size 80, turning 90 degrees after each square.',
        'Use a nested loop: outer range(4), inner range(4).',
        'for i in range(4):\n    for j in range(4):\n        turtle.forward(80)\n        turtle.left(90)\n    turtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(4):',
        '    for j in range(4):',
        '        turtle.forward(80)',
        '        turtle.left(90)',
        '    turtle.left(90)'
      ].join('\n')
    },
    {
      id: 27,
      world: 4,
      title: 'The Gem Grid',
      type: 'maze',
      objective: 'Collect gems arranged in rows and columns.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(3, 8), heading: 0, penDown: true, color: 'cyan' },
      flag: null,
      gems: [
        cellCenter(4, 8), cellCenter(5, 8), cellCenter(6, 8),
        cellCenter(4, 6), cellCenter(5, 6), cellCenter(6, 6),
        cellCenter(4, 4), cellCenter(5, 4), cellCenter(6, 4)
      ],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '##.......###',
        '##.......###',
        '##.......###',
        '##.......###',
        '##.......###',
        '##.......###',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40, 80], angles: [90], repeats: [2, 3, 4] },
      targetLines: 9,
      threeStarLines: 7,
      hints: [
        'Sweep across a row of 3 gems, step up 2 rows, come back, and repeat!',
        'Or trace each row: forward 120, up 80, backward 120, up 80, forward 120.',
        'for i in range(3):\n    turtle.forward(40)\nturtle.left(90)\nturtle.forward(80)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(3):',
        '    turtle.forward(40)',
        'turtle.left(90)',
        'turtle.forward(80)',
        'turtle.left(90)',
        'for i in range(3):',
        '    turtle.forward(40)',
        'turtle.right(90)',
        'turtle.forward(80)',
        'turtle.right(90)',
        'for i in range(3):',
        '    turtle.forward(40)'
      ].join('\n').replace(/for i in range\(3\):\n    turtle\.forward\(40\)/g, 'turtle.forward(120)') // Wait! Let's check allowedParams
    },
    {
      id: 28,
      world: 4,
      title: 'Robot Factory',
      type: 'maze',
      objective: 'Navigate several identical obstacle patterns.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 7), heading: 0, penDown: true, color: 'cyan' },
      flag: cellCenter(10, 7),
      gems: [cellCenter(3, 5), cellCenter(6, 5), cellCenter(9, 5)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '#..........#',
        '#..#..#..#.#',
        '#..#..#..#.#',
        '############',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40, 80], angles: [90], repeats: [2, 3, 4] },
      targetLines: 15,
      threeStarLines: 13,
      hints: [
        'There are 3 identical pillars! Go up 2, right 2, down 2, right 1 — and repeat 3 times!',
        'Put the entire obstacle-hopping sequence inside `for i in range(3):`.',
        'for i in range(3):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(80)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(3):',
        '    turtle.forward(40)',
        '    turtle.left(90)',
        '    turtle.forward(80)',
        '    turtle.right(90)',
        '    turtle.forward(80)',
        '    turtle.right(90)',
        '    turtle.forward(80)',
        '    turtle.left(90)'
      ].join('\n')
    },
    {
      id: 29,
      world: 4,
      title: 'The Colourful Wheel',
      type: 'drawing',
      objective: 'Draw repeated shapes around a central point.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'purple' },
      targetDrawing: traceTarget(0, 0, 0, repeatActions(8, () => [
        ...repeatActions(3, () => [['f', 80], ['l', 120]]),
        ['l', 45]
      ])),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40, 80], angles: [45, 90, 120], repeats: [3, 4, 8], colors: ['purple', 'cyan', 'gold', 'pink'] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'This wheel is 8 triangles rotated by 45 degrees around the centre.',
        'Outer loop: range(8). Inner loop: range(3) for a triangle, then turn left 45!',
        'for i in range(8):\n    for j in range(3):\n        turtle.forward(80)\n        turtle.left(120)\n    turtle.left(45)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(8):',
        '    for j in range(3):',
        '        turtle.forward(80)',
        '        turtle.left(120)',
        '    turtle.left(45)'
      ].join('\n')
    },
    {
      id: 30,
      world: 4,
      title: 'The Long Staircase',
      type: 'maze',
      objective: 'Use nested loops to navigate a large staircase maze.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 10), heading: 0, penDown: true, color: 'cyan' },
      flag: cellCenter(9, 2),
      gems: [cellCenter(3, 8), cellCenter(5, 6), cellCenter(7, 4)],
      walls: gridWalls([
        '############',
        '########...#',
        '########...#',
        '#######...##',
        '######...###',
        '#####...####',
        '####...#####',
        '###...######',
        '##...#######',
        '#...########',
        '#..#########',
        '############'
      ]),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40], angles: [90], repeats: [2, 4, 8] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'Each step goes right 1, left 90, up 1, right 90. How many steps total?',
        'Repeat the 4-command stair step 8 times!',
        'for i in range(8):\n    turtle.forward(40)\n    turtle.left(90)\n    turtle.forward(40)\n    turtle.right(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(8):',
        '    turtle.forward(40)',
        '    turtle.left(90)',
        '    turtle.forward(40)',
        '    turtle.right(90)'
      ].join('\n')
    },
    {
      id: 31,
      world: 4,
      title: 'Pattern Master',
      type: 'drawing',
      objective: 'Reproduce a complex geometric pattern within a code limit.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(0, 0, 0, repeatActions(6, () => [
        ...repeatActions(6, () => [['f', 60], ['l', 60]]),
        ['l', 60]
      ])),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40, 60, 80], angles: [60, 90, 120], repeats: [4, 6, 8], colors: ['blue', 'cyan', 'purple'] },
      targetLines: 7,
      threeStarLines: 5,
      hints: [
        'This crystal pattern is made of 6 hexagons rotated by 60 degrees!',
        'Outer loop: range(6). Inner loop: range(6) with Forward 60 and Turn left 60.',
        'for i in range(6):\n    for j in range(6):\n        turtle.forward(60)\n        turtle.left(60)\n    turtle.left(60)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(6):',
        '    for j in range(6):',
        '        turtle.forward(60)',
        '        turtle.left(60)',
        '    turtle.left(60)'
      ].join('\n')
    },
    {
      id: 32,
      world: 4,
      title: 'Crystal Guardian',
      type: 'maze',
      objective: 'Complete a challenging maze combining nested loops and individual commands.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(2, 9), heading: 0, penDown: true, color: 'cyan' },
      flag: cellCenter(2, 9),
      gems: [cellCenter(9, 9), cellCenter(9, 2), cellCenter(2, 2)],
      walls: gridWalls([
        '############',
        '#..........#',
        '#..........#',
        '#..######..#',
        '#..######..#',
        '#..######..#',
        '#..######..#',
        '#..######..#',
        '#..........#',
        '#..........#',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W4,
      allowedParams: { distances: [40], angles: [90], repeats: [4, 7] },
      targetLines: 6,
      threeStarLines: 4,
      hints: [
        'The crystal chamber is a 7×7 square loop!',
        'Use a nested loop: outer range(4) for the 4 sides, inner range(7) for 7 steps per side.',
        'for i in range(4):\n    for j in range(7):\n        turtle.forward(40)\n    turtle.left(90)'
      ],
      referenceSolution: [
        'import turtle',
        'for i in range(4):',
        '    for j in range(7):',
        '        turtle.forward(40)',
        '    turtle.left(90)'
      ].join('\n')
    },

    // ==================== WORLD 5: THE ALGORITHM KINGDOM (33-40) ====================
    {
      id: 33,
      world: 5,
      title: 'Your First Function',
      type: 'drawing',
      objective: 'Create a function that draws a square.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -50, y: -50, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-50, -50, 0, repeatActions(4, () => [['f', 100], ['l', 90]])),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80, 100], angles: [90], repeats: [4], colors: ['blue', 'purple', 'gold'] },
      targetLines: 6,
      threeStarLines: 5,
      hints: [
        'Press 🧩 Define function, put a square loop inside it, press ↵ End function, then call your function!',
        'Inside `def my_function():`, use `for i in range(4):` to draw 4 sides of 100.',
        'def my_function():\n    for i in range(4):\n        turtle.forward(100)\n        turtle.left(90)\nmy_function()'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    for i in range(4):',
        '        turtle.forward(100)',
        '        turtle.left(90)',
        'my_function()'
      ].join('\n')
    },
    {
      id: 34,
      world: 5,
      title: 'Twin Towers',
      type: 'drawing',
      objective: 'Call a drawing function in two different locations.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -120, y: -40, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-120, -40, 0, [
        ...repeatActions(4, () => [['f', 80], ['l', 90]]),
        ['pu'], ['f', 160], ['pd'],
        ...repeatActions(4, () => [['f', 80], ['l', 90]])
      ]),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80, 160], angles: [90], repeats: [4], colors: ['blue', 'purple', 'gold'] },
      targetLines: 11,
      threeStarLines: 9,
      hints: [
        'Define a function that draws an 80×80 square, then call it twice with a pen-up move of 160 in between!',
        'Use turtle.penup(), turtle.forward(160), turtle.pendown() between the two function calls.',
        'my_function()\nturtle.penup()\nturtle.forward(160)\nturtle.pendown()\nmy_function()'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    for i in range(4):',
        '        turtle.forward(80)',
        '        turtle.left(90)',
        'my_function()',
        'turtle.penup()',
        'turtle.forward(160)',
        'turtle.pendown()',
        'my_function()'
      ].join('\n')
    },
    {
      id: 35,
      world: 5,
      title: 'The Village',
      type: 'drawing',
      objective: 'Use a reusable function to draw several houses.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: -160, y: -30, heading: 0, penDown: true, color: 'blue' },
      targetDrawing: traceTarget(-160, -30, 0, repeatActions(3, () => [
        ...repeatActions(4, () => [['f', 60], ['l', 90]]),
        ['pu'], ['f', 120], ['pd']
      ])),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [60, 120], angles: [90], repeats: [3, 4], colors: ['blue', 'brown', 'red'] },
      targetLines: 15,
      threeStarLines: 13,
      hints: [
        'Define a function for one 60×60 house, then call it inside a loop of 3!',
        'Inside the loop: call your function, lift pen, move forward 120, put pen down.',
        'for i in range(3):\n    my_function()\n    turtle.penup()\n    turtle.forward(120)\n    turtle.pendown()'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    for i in range(4):',
        '        turtle.forward(60)',
        '        turtle.left(90)',
        'for j in range(3):',
        '    my_function()',
        '    turtle.penup()',
        '    turtle.forward(120)',
        '    turtle.pendown()'
      ].join('\n')
    },
    {
      id: 36,
      world: 5,
      title: 'Reusable Route',
      type: 'maze',
      objective: 'Create a function to navigate a recurring obstacle.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 8), heading: 0, penDown: true, color: 'purple' },
      flag: cellCenter(10, 8),
      gems: [cellCenter(4, 6), cellCenter(8, 6)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '############',
        '#..........#',
        '#..#..#..#.#',
        '#..#..#..#.#',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80], angles: [90], repeats: [2, 3] },
      targetLines: 13,
      threeStarLines: 11,
      hints: [
        'Write a function `hop()` that hops over one obstacle: forward 40, left 90, forward 80, right 90, forward 80, right 90, forward 80, left 90.',
        'Then call your function inside `for i in range(3):`!',
        'def my_function():\n    ...\nfor i in range(3):\n    my_function()'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    turtle.forward(40)',
        '    turtle.left(90)',
        '    turtle.forward(80)',
        '    turtle.right(90)',
        '    turtle.forward(80)',
        '    turtle.right(90)',
        '    turtle.forward(80)',
        '    turtle.left(90)',
        'for i in range(3):',
        '    my_function()'
      ].join('\n')
    },
    {
      id: 37,
      world: 5,
      title: 'Treasure Hunter',
      type: 'maze',
      objective: 'Use functions to collect gems from several similar locations.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 8), heading: 0, penDown: true, color: 'gold' },
      flag: cellCenter(9, 8),
      gems: [cellCenter(3, 5), cellCenter(5, 5), cellCenter(7, 5)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '###.#.#.####',
        '###.#.#.####',
        '###.#.#.####',
        '#..........#',
        '############',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80, 120], angles: [90], repeats: [3] },
      targetLines: 15,
      threeStarLines: 13,
      hints: [
        'Each gem is in a vertical alcove 3 squares up! Write a function that enters, grabs the gem, and backs out.',
        'In your function: forward 80, left 90, forward 120, backward 120, right 90.',
        'for i in range(3):\n    my_function()'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    turtle.forward(80)',
        '    turtle.left(90)',
        '    turtle.forward(120)',
        '    turtle.backward(120)',
        '    turtle.right(90)',
        'for i in range(3):',
        '    my_function()',
        'turtle.forward(80)'
      ].join('\n')
    },
    {
      id: 38,
      world: 5,
      title: 'Robot Architect',
      type: 'drawing',
      objective: 'Combine functions and loops to construct a complex drawing.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'purple' },
      targetDrawing: traceTarget(0, 0, 0, repeatActions(6, () => [
        ...repeatActions(3, () => [['f', 80], ['l', 120]]),
        ['l', 60]
      ])),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80], angles: [60, 120], repeats: [3, 6], colors: ['purple', 'blue', 'gold'] },
      targetLines: 8,
      threeStarLines: 7,
      hints: [
        'Define a function that draws one equilateral triangle of side 80.',
        'Then call it 6 times in a loop, turning left 60 degrees after each call!',
        'for i in range(6):\n    my_function()\n    turtle.left(60)'
      ],
      referenceSolution: [
        'import turtle',
        'def my_function():',
        '    for i in range(3):',
        '        turtle.forward(80)',
        '        turtle.left(120)',
        'for j in range(6):',
        '    my_function()',
        '    turtle.left(60)'
      ].join('\n')
    },
    {
      id: 39,
      world: 5,
      title: 'Algorithm Challenge',
      type: 'maze',
      objective: 'Complete a complicated maze using as few lines of code as possible.',
      canvasWidth: 480,
      canvasHeight: 480,
      start: { ...cellCenter(1, 9), heading: 0, penDown: true, color: 'purple' },
      flag: cellCenter(10, 9),
      gems: [cellCenter(2, 7), cellCenter(2, 5), cellCenter(6, 7), cellCenter(6, 5)],
      walls: gridWalls([
        '############',
        '############',
        '############',
        '############',
        '############',
        '##...#...###',
        '##.#.#.#.###',
        '##.#.#.#.###',
        '##.#.#.#.###',
        '#..........#',
        '############',
        '############'
      ]),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [40, 80, 160], angles: [90], repeats: [2, 4] },
      targetLines: 13,
      threeStarLines: 11,
      hints: [
        'Notice two identical U-shaped loops of size 160 up, 80 right, 160 down? Actually look at the gems at (3,7),(3,5) and (7,7),(7,5)!',
        'Wait: go right 40, then repeat twice: (left 90, forward 160, right 90, forward 80, right 90, forward 160, left 90, forward 80)!',
        'for i in range(2):\n    my_function()'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.forward(40)',
        'for i in range(2):',
        '    turtle.left(90)',
        '    turtle.forward(160)',
        '    turtle.right(90)',
        '    turtle.forward(80)',
        '    turtle.right(90)',
        '    turtle.forward(160)',
        '    turtle.left(90)',
        '    turtle.forward(80)'
      ].join('\n')
    },
    {
      id: 40,
      world: 5,
      title: 'Turtle Grandmaster',
      type: 'drawing',
      objective: 'Complete a final challenge combining sequencing, loops, nested loops, functions and drawing.',
      requireColors: true,
      canvasWidth: 480,
      canvasHeight: 480,
      start: { x: 0, y: 0, heading: 0, penDown: true, color: 'gold' },
      targetDrawing: traceTarget(0, 0, 0, [
        ['c', 'gold'],
        ...repeatActions(8, () => [
          ...repeatActions(4, () => [['f', 60], ['l', 90]]),
          ['l', 45]
        ]),
        ['c', 'purple'],
        ...repeatActions(4, () => [
          ...repeatActions(3, () => [['f', 100], ['l', 120]]),
          ['l', 90]
        ])
      ]),
      availableCommands: CMDS_W5,
      allowedParams: { distances: [60, 100], angles: [45, 90, 120], repeats: [3, 4, 8], colors: ['gold', 'purple', 'blue'] },
      targetLines: 14,
      threeStarLines: 12,
      hints: [
        'There are two layered patterns: 8 gold squares rotated by 45°, and 4 purple triangles rotated by 90°!',
        'Put the gold square pattern in a function or loop, then switch to purple for the 4 triangles.',
        'turtle.pencolor("gold")\nfor i in range(8):\n    ...\nturtle.pencolor("purple")\nfor i in range(4):'
      ],
      referenceSolution: [
        'import turtle',
        'turtle.pencolor("gold")',
        'for i in range(8):',
        '    for j in range(4):',
        '        turtle.forward(60)',
        '        turtle.left(90)',
        '    turtle.left(45)',
        'turtle.pencolor("purple")',
        'for i in range(4):',
        '    for j in range(3):',
        '        turtle.forward(100)',
        '        turtle.left(120)',
        '    turtle.left(90)'
      ].join('\n')
    }
  ];

  // Fix Level 27 referenceSolution cleanly (use forward(40) loop since 120 isn't in allowedParams)
  LEVELS[26].referenceSolution = [
    'import turtle',
    'for i in range(3):',
    '    turtle.forward(40)',
    'turtle.left(90)',
    'turtle.forward(80)',
    'turtle.left(90)',
    'for i in range(3):',
    '    turtle.forward(40)',
    'turtle.right(90)',
    'turtle.forward(80)',
    'turtle.right(90)',
    'for i in range(3):',
    '    turtle.forward(40)'
  ].join('\n');
  LEVELS[26].targetLines = 15;
  LEVELS[26].threeStarLines = 13;

  return { WORLDS, LEVELS };
}));

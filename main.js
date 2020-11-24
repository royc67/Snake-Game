const GRID_LENGTH = 30;
const APPLE = "fa fa-apple apple";
const SPEED = 40;
const container = document.querySelector("#container");
let body = [[0, 0]];
let foodPos = [
  Math.floor(Math.random() * GRID_LENGTH),
  Math.floor(Math.random() * GRID_LENGTH),
];
let justAte = false;
let currentVec = 2;
let lastVec = 2;
let isAlive = true;
let currentInterval;
let score = 0;

const vectors = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
let grid;
// let grid = Array.from({ length: GRID_LENGTH }, () =>
//   Array.from({ length: GRID_LENGTH }, () => "")
// );

// let [headX, headY] = body[0];
let headX, headY;
// let [foodX, foodY] = foodPos;
let foodX, foodY;

// functions
const draw = () => {
  container.innerHTML = "";
  grid.forEach((row) => {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    row.forEach((square) => {
      const squareElement = document.createElement("div");
      squareElement.className = `square ${square}`;
      rowElement.appendChild(squareElement);
    });
    container.appendChild(rowElement);
  });
};

const changeVector = ({ keyCode }) => {
  if (keyCode < 37 || keyCode > 40) return;
  currentVec = keyCode - 37;
  if (Math.abs(currentVec - lastVec) === 2) currentVec = lastVec;
};

const move = () => {
  const [pastX, pastY] = body[0];

  let newX = pastX + vectors[currentVec][0];
  newX = ((newX % GRID_LENGTH) + GRID_LENGTH) % GRID_LENGTH;
  let newY = pastY + vectors[currentVec][1];
  newY = ((newY % GRID_LENGTH) + GRID_LENGTH) % GRID_LENGTH;

  body.unshift([newX, newY]);
  if (!justAte) {
    const [lastX, lastY] = body.pop();
    grid[lastX][lastY] = "";
  } else {
    justAte = false;
    score++;
  }

  body.forEach(([x, y]) => (grid[x][y] = "snake"));
  const [x, y] = foodPos;
  grid[x][y] = APPLE;
};

const genFood = () => {
  if (body[0][0] === foodPos[0] && body[0][1] === foodPos[1]) {
    do {
      foodPos[0] = Math.floor(Math.random() * grid.length);
      foodPos[1] = Math.floor(Math.random() * grid.length);
    } while (grid[foodPos[0]][foodPos[1]] === "snake");
    grid[foodPos[0]][foodPos[1]] = APPLE;

    justAte = true;
  }
};

const checkDead = () => {
  const [headX, headY] = body[0];

  isAlive = !body.slice(1).filter(([x, y]) => x === headX && y === headY)
    .length;
};

document.addEventListener("keydown", changeVector);

const startGame = (boardSize = 1, difficulty = 1) => {
  score = 0;
  body = [[0, 0]];
  foodPos = [
    Math.floor(Math.random() * GRID_LENGTH),
    Math.floor(Math.random() * GRID_LENGTH),
  ];
  justAte = false;
  currentVec = 2;
  lastVec = 2;
  isAlive = true;
  // grid.forEach((row) => row.fill("", 0));
  grid = Array.from({ length: GRID_LENGTH / boardSize }, () =>
    Array.from({ length: GRID_LENGTH / boardSize }, () => "")
  );

  [foodX, foodY] = foodPos;
  [headX, headY] = body[0];

  grid[headX][headY] = "snake";
  grid[foodX][foodY] = APPLE;

  clearInterval(currentInterval);
  currentInterval = setInterval(() => {
    if (!isAlive) {
      clearInterval(currentInterval);
      return;
    }
    move();
    genFood();
    draw();
    checkDead();
    lastVec = currentVec;
  }, SPEED / difficulty);
};

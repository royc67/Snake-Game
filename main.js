// consts
const GRID_LENGTH = 30;
const APPLE = "fa fa-apple apple";
const SPEED = 100;
const vectors = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];

// Elements Declaration
const difficultySelector = document.getElementById("difficultySelector");
const boardSizeSelector = document.getElementById("boardSizeSelector");
const container = document.getElementById("container");
const startGameButton = document.getElementById("startGameBtn");
const scoreElement = document.getElementById("score");
scoreElement.innerText = 0;

// Game Variables
let currentIntervalID;
let difficulty, boardSize, score;
let grid, snakeBody, foodPosition, justAte, isAlive;
let currentVector = 2,
  lastVector;
let headX, headY;
let foodX, foodY;

// functions
const draw = () => {
  container.innerHTML = "";
  let black = true;
  grid.forEach((row, x) => {
    const rowElement = document.createElement("div");
    rowElement.className = "row";
    row.forEach((square, y) => {
      const squareElement = document.createElement("div");
      squareElement.className = `square ${square} ${black ? "black" : "grey"}`;
      // squareElement.className += x % 2 && y % 2 ? " grey" : " black";
      // squareElement.className += !(x % 2) && !(y % 2) ? " grey" : " black";
      rowElement.appendChild(squareElement);
      black = !black;
    });
    container.appendChild(rowElement);
    black = !black;
  });
};

const changeVector = ({ keyCode }) => {
  if (keyCode < 37 || keyCode > 40) return;
  currentVector = keyCode - 37;
  if (Math.abs(currentVector - lastVector) === 2) currentVector = lastVector;
};

const move = () => {
  const [pastX, pastY] = snakeBody[0];

  let newX = pastX + vectors[currentVector][0];
  newX = ((newX % grid.length) + grid.length) % grid.length;
  let newY = pastY + vectors[currentVector][1];
  newY = ((newY % grid.length) + grid.length) % grid.length;

  snakeBody.unshift([newX, newY]);
  if (!justAte) {
    const [lastX, lastY] = snakeBody.pop();
    grid[lastX][lastY] = "";
  } else {
    justAte = false;
    score++;
    scoreElement.innerText = score;
  }

  snakeBody.forEach(([x, y]) => (grid[x][y] = "snake"));
};

const genFood = () => {
  if (
    snakeBody[0][0] === foodPosition[0] &&
    snakeBody[0][1] === foodPosition[1]
  ) {
    do {
      foodPosition[0] = Math.floor(Math.random() * grid.length);
      foodPosition[1] = Math.floor(Math.random() * grid.length);
    } while (grid[foodPosition[0]][foodPosition[1]] === "snake");
    grid[foodPosition[0]][foodPosition[1]] = APPLE;

    justAte = true;
  }
};

const checkDead = () => {
  const [headX, headY] = snakeBody[0];

  isAlive = !snakeBody.slice(1).filter(([x, y]) => x === headX && y === headY)
    .length;
};

const startGame = () => {
  difficulty = parseInt(difficultySelector.value);
  boardSize = parseInt(boardSizeSelector.value);
  score = 0;
  scoreElement.innerText = score;
  snakeBody = [[0, 0]];
  foodPosition = [
    Math.floor((Math.random() * GRID_LENGTH) / boardSize),
    Math.floor((Math.random() * GRID_LENGTH) / boardSize),
  ];
  justAte = false;
  currentVector = 2;
  lastVector = 2;
  isAlive = true;
  // grid.forEach((row) => row.fill("", 0));
  grid = Array.from({ length: GRID_LENGTH / boardSize }, () =>
    Array.from({ length: GRID_LENGTH / boardSize }, () => "")
  );

  [foodX, foodY] = foodPosition;
  [headX, headY] = snakeBody[0];

  grid[headX][headY] = "snake";
  grid[foodX][foodY] = APPLE;

  clearInterval(currentIntervalID);
  currentIntervalID = setInterval(() => {
    if (!isAlive) {
      clearInterval(currentIntervalID);
      return;
    }
    move();
    genFood();
    draw();
    checkDead();
    lastVector = currentVector;
  }, SPEED / difficulty);
};
document.addEventListener("keydown", changeVector);
startGameButton.addEventListener("click", startGame);
startGame();

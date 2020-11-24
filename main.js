const GRID_LENGTH = 30;
const APPLE = "fa fa-apple apple";
const SPEED = 40;
const container = document.querySelector("#container");
const body = [[0, 0]];
const foodPos = [
  Math.floor(Math.random() * GRID_LENGTH),
  Math.floor(Math.random() * GRID_LENGTH),
];
let justAte = false;
let currentVec = 2;
let lastVec = 2;
let isAlive = true;

const vectors = [
  [0, -1],
  [-1, 0],
  [0, 1],
  [1, 0],
];
const grid = Array.from({ length: GRID_LENGTH }, () =>
  Array.from({ length: GRID_LENGTH }, () => "")
);

const [headX, headY] = body[0];
const [foodX, foodY] = foodPos;

grid[headX][headY] = "snake";
grid[foodX][foodY] = APPLE;

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

  //   if (pastY === 0 && currentVec === 0) newY = GRID_LENGTH - 1;
  //   if (pastX === 0 && currentVec === 1) newX = GRID_LENGTH - 1;
  //   if (pastY === GRID_LENGTH - 1 && currentVec === 2) newY = 0;
  //   if (pastX === GRID_LENGTH - 1 && currentVec === 3) newX = 0;

  body.unshift([newX, newY]);
  if (!justAte) {
    const [lastX, lastY] = body.pop();
    grid[lastX][lastY] = "";
  } else justAte = false;

  body.forEach(([x, y]) => (grid[x][y] = "snake"));
  const [x, y] = foodPos;
  grid[x][y] = APPLE;
};

const genFood = () => {
  if (body[0][0] === foodPos[0] && body[0][1] === foodPos[1]) {
    do {
      foodPos[0] = Math.floor(Math.random() * grid.length);
      foodPos[1] = Math.floor(Math.random() * grid.length);
      console.log(grid[foodPos[0]][foodPos[1]] === "snake");
    } while (grid[foodPos[0]][foodPos[1]] === "snake");
    // {
    //   foodPos[0] = Math.floor(Math.random() * grid.length);
    //   foodPos[1] = Math.floor(Math.random() * grid.length);
    // }
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
setInterval(() => {
  if (!isAlive) return;
  move();
  genFood();
  draw();
  checkDead();
  lastVec = currentVec;
}, SPEED);

draw();

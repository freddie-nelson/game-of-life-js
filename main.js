const canvas = document.getElementById("canvas");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let CELL_SIZE = 8;
let COLS = canvas.width / CELL_SIZE;
let ROWS = canvas.height / CELL_SIZE;

let grid = [];
let buffer = [];
const initGrid = () => {
  grid = [];
  buffer = [];

  for (let i = 0; i < ROWS; i++) {
    let arr = [];

    for (let j = 0; j < COLS; j++) {
      if (Math.random() < 0.5) arr.push(false);
      else arr.push(true);
    }

    grid.push(arr);
    buffer.push([...arr]);
  }
};
initGrid();

const getNeighbours = (grid, row, column) => {
  let neighbours = [];

  let t = false;
  let b = false;
  let r = false;
  let l = false;

  //top
  if (row - 1 >= 0) {
    t = true;
    neighbours.push(grid[row - 1][column]);
  }

  //bottom
  if (row + 1 < ROWS - 1) {
    b = true;
    neighbours.push(grid[row + 1][column]);
  }

  //left
  if (column - 1 >= 0) {
    l = true;
    neighbours.push(grid[row][column - 1]);
  }

  //right
  if (column + 1 < COLS - 1) {
    r = true;
    neighbours.push(grid[row][column + 1]);
  }

  if (t) {
    if (l) neighbours.push(grid[row - 1][column - 1]);
    if (r) neighbours.push(grid[row - 1][column + 1]);
  }

  if (b) {
    if (l) neighbours.push(grid[row + 1][column - 1]);
    if (r) neighbours.push(grid[row + 1][column + 1]);
  }

  return neighbours;
};

const applyRules = () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      buffer[r][c] = grid[r][c];
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      const neighbours = getNeighbours(grid, r, c);
      const nCount = neighbours.reduce((c, n) => (n ? ++c : c), 0);

      // live
      if (grid[r][c]) {
        if (nCount < 2) {
          buffer[r][c] = false;
        } else if (nCount > 3) {
          buffer[r][c] = false;
        }
      } else if (nCount === 3) {
        buffer[r][c] = true;
      }
    }
  }

  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = buffer[r][c];
    }
  }
};

let play = false;
const button = document.createElement("button");
button.addEventListener("click", () => (play = !play));
button.innerText = "Toggle Play";
document.body.appendChild(button);
button.style = "position: absolute; top: 0; right: 0;";

const randomizeBtn = document.createElement("button");
randomizeBtn.addEventListener("click", initGrid);
randomizeBtn.innerText = "Randomize";
document.body.appendChild(randomizeBtn);
randomizeBtn.style = "position: absolute; top: 20px; right: 0;";

const clearBtn = document.createElement("button");
clearBtn.addEventListener("click", () => {
  for (let r = 0; r < ROWS; r++) {
    for (let c = 0; c < COLS; c++) {
      grid[r][c] = false;
    }
  }
});
clearBtn.innerText = "Clear";
document.body.appendChild(clearBtn);
clearBtn.style = "position: absolute; top: 40px; right: 0;";

const sizeSlider = document.createElement("input");
sizeSlider.addEventListener("input", () => {
  CELL_SIZE = sizeSlider.value;
  COLS = canvas.clientWidth / CELL_SIZE;
  ROWS = canvas.clientHeight / CELL_SIZE;
  initGrid();
});
sizeSlider.min = 3;
sizeSlider.max = 40;
sizeSlider.value = CELL_SIZE;
sizeSlider.type = "range";
document.body.appendChild(sizeSlider);
sizeSlider.style = "position: absolute; bottom: 5px; right: 0; width: 12rem;";

let mousePressed = false;
canvas.addEventListener("mousedown", () => (mousePressed = true));
document.body.addEventListener("mouseup", () => (mousePressed = false));

const toggleCell = (e) => {
  if (!mousePressed) return;

  const r = Math.floor(e.clientY / CELL_SIZE);
  const c = Math.floor(e.clientX / CELL_SIZE);

  grid[r][c] = !(e.which === 3 || e.button === 2);
};

canvas.addEventListener("mousemove", toggleCell);
canvas.addEventListener("mousedown", toggleCell);
canvas.addEventListener("contextmenu", (e) => e.preventDefault());

const tick = () => {
  ctx.fillStyle = "black";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "white";
  ctx.strokeStyle = "white";
  for (let i = 0; i < ROWS; i++) {
    for (let j = 0; j < COLS; j++) {
      if (grid[i][j]) {
        ctx.fillRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
      } else if (!play) {
        ctx.globalAlpha = 0.3;
        ctx.strokeRect(j * CELL_SIZE, i * CELL_SIZE, CELL_SIZE, CELL_SIZE);
        ctx.globalAlpha = 1;
      }
    }
  }

  if (play) applyRules();
};

setInterval(tick, 120);

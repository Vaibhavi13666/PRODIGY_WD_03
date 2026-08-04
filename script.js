const WIN_COMBOS = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8], // rows
  [0, 3, 6], [1, 4, 7], [2, 5, 8], // columns
  [0, 4, 8], [2, 4, 6]             // diagonals
];

const CELL_CENTER = [
  [53, 53],   [150, 53],  [247, 53],
  [53, 150],  [150, 150], [247, 150],
  [53, 247],  [150, 247], [247, 247]
];

const state = {
  board: Array(9).fill(null),
  currentPlayer: "X",
  gameOver: false,
  round: 1,
  scores: { X: 0, O: 0, draw: 0 }
};

const boardEl = document.getElementById("board");
const cells = Array.from(document.querySelectorAll(".cell"));
const turnIndicator = document.getElementById("turnIndicator");
const roundNumberEl = document.getElementById("roundNumber");
const scoreXValue = document.getElementById("scoreXValue");
const scoreOValue = document.getElementById("scoreOValue");
const scoreDrawValue = document.getElementById("scoreDrawValue");
const newRoundBtn = document.getElementById("newRound");
const resetScoresBtn = document.getElementById("resetScores");
const strikeLine = document.getElementById("strikeLine");
const strikeLinePath = document.getElementById("strikeLinePath");
const toastEl = document.getElementById("toast");

function init() {
  cells.forEach((cell) => {
    cell.addEventListener("click", () => handleCellClick(cell));
  });
  newRoundBtn.addEventListener("click", startNewRound);
  resetScoresBtn.addEventListener("click", resetScores);
  updateTurnIndicator();
}

function handleCellClick(cell) {
  const index = Number(cell.dataset.index);
  if (state.gameOver || state.board[index]) return;

  state.board[index] = state.currentPlayer;
  cell.textContent = state.currentPlayer;
  cell.classList.add(`marked-${state.currentPlayer.toLowerCase()}`, "pop");
  cell.disabled = true;

  const winInfo = checkWin();
  if (winInfo) {
    endRound(winInfo);
    return;
  }

  if (state.board.every(Boolean)) {
    endRound(null); // draw
    return;
  }

  state.currentPlayer = state.currentPlayer === "X" ? "O" : "X";
  updateTurnIndicator();
}

function checkWin() {
  for (const combo of WIN_COMBOS) {
    const [a, b, c] = combo;
    if (state.board[a] && state.board[a] === state.board[b] && state.board[a] === state.board[c]) {
      return { combo, winner: state.board[a] };
    }
  }
  return null;
}

function endRound(winInfo) {
  state.gameOver = true;
  cells.forEach((cell) => (cell.disabled = true));

  if (winInfo) {
    const { combo, winner } = winInfo;
    combo.forEach((i) => cells[i].classList.add("winning-cell"));
    drawStrikeLine(combo);
    state.scores[winner] += 1;
    scoreXValue.textContent = state.scores.X;
    scoreOValue.textContent = state.scores.O;
    turnIndicator.textContent = `Player ${winner} wins this round`;
    turnIndicator.classList.add("win");
    showToast(`Player ${winner} takes round ${state.round}`);
  } else {
    state.scores.draw += 1;
    scoreDrawValue.textContent = state.scores.draw;
    turnIndicator.textContent = "It's a draw";
    turnIndicator.classList.add("win");
    showToast("Nobody's board this time — it's a draw");
  }
}

function drawStrikeLine(combo) {
  const [start, , end] = combo;
  const [x1, y1] = CELL_CENTER[start];
  const [x2, y2] = CELL_CENTER[end];

  const dx = x2 - x1;
  const dy = y2 - y1;
  const extend = 26;
  const len = Math.hypot(dx, dy) || 1;
  const ux = (dx / len) * extend;
  const uy = (dy / len) * extend;

  strikeLinePath.setAttribute("x1", x1 - ux);
  strikeLinePath.setAttribute("y1", y1 - uy);
  strikeLinePath.setAttribute("x2", x2 + ux);
  strikeLinePath.setAttribute("y2", y2 + uy);

  requestAnimationFrame(() => strikeLine.classList.add("draw-line"));
}

function updateTurnIndicator() {
  turnIndicator.classList.remove("win");
  turnIndicator.textContent = `Player ${state.currentPlayer}'s move`;
}

function startNewRound() {
  state.board = Array(9).fill(null);
  state.currentPlayer = "X";
  state.gameOver = false;
  state.round += 1;
  roundNumberEl.textContent = state.round;

  cells.forEach((cell) => {
    cell.textContent = "";
    cell.disabled = false;
    cell.className = "cell";
  });

  strikeLine.classList.remove("draw-line");
  strikeLinePath.setAttribute("x1", 0);
  strikeLinePath.setAttribute("y1", 0);
  strikeLinePath.setAttribute("x2", 0);
  strikeLinePath.setAttribute("y2", 0);

  updateTurnIndicator();
}

function resetScores() {
  state.scores = { X: 0, O: 0, draw: 0 };
  state.round = 0;
  scoreXValue.textContent = 0;
  scoreOValue.textContent = 0;
  scoreDrawValue.textContent = 0;
  showToast("Scoreboard cleared");
  startNewRound();
}

let toastTimeout;
function showToast(message) {
  clearTimeout(toastTimeout);
  toastEl.textContent = message;
  toastEl.classList.add("show");
  toastTimeout = setTimeout(() => toastEl.classList.remove("show"), 2200);
}

init();
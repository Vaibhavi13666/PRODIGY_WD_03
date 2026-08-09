/* =====================================
   TIC TAC TOE
   PRODIGY INFOTECH - TASK 03
===================================== */


/* =====================================
   ELEMENTS
===================================== */

const cells = document.querySelectorAll(".cell");

const turnMessage = document.getElementById("turnMessage");

const scoreXElement = document.getElementById("scoreX");
const scoreOElement = document.getElementById("scoreO");
const scoreDrawsElement = document.getElementById("scoreDraws");

const resultMessage = document.getElementById("resultMessage");

const newGameBtn = document.getElementById("newGameBtn");
const resetBtn = document.getElementById("resetBtn");

const turnDot = document.querySelector(".turn-dot");


/* =====================================
   GAME VARIABLES
===================================== */

let board = [
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    "",
    ""
];

let currentPlayer = "X";

let gameActive = true;


/* =====================================
   SCORE
===================================== */

let scores = {
    X: 0,
    O: 0,
    draws: 0
};


/* =====================================
   WINNING COMBINATIONS
===================================== */

const winningCombinations = [

    [0, 1, 2],

    [3, 4, 5],

    [6, 7, 8],

    [0, 3, 6],

    [1, 4, 7],

    [2, 5, 8],

    [0, 4, 8],

    [2, 4, 6]

];


/* =====================================
   LOAD SAVED SCORE
===================================== */

function loadScore() {

    const savedScore = localStorage.getItem("ticTacToeScores");

    if (savedScore) {

        try {

            scores = JSON.parse(savedScore);

        } catch (error) {

            scores = {
                X: 0,
                O: 0,
                draws: 0
            };

        }

    }

    updateScoreDisplay();
}


/* =====================================
   SAVE SCORE
===================================== */

function saveScore() {

    localStorage.setItem(
        "ticTacToeScores",
        JSON.stringify(scores)
    );
}


/* =====================================
   UPDATE SCORE DISPLAY
===================================== */

function updateScoreDisplay() {

    scoreXElement.textContent = scores.X;

    scoreOElement.textContent = scores.O;

    scoreDrawsElement.textContent = scores.draws;
}


/* =====================================
   CELL CLICK
===================================== */

function handleCellClick(event) {

    const clickedCell = event.currentTarget;

    const index = Number(clickedCell.dataset.index);


    // Don't allow moves after game ends

    if (!gameActive) {
        return;
    }


    // Don't allow an already occupied cell

    if (board[index] !== "") {
        return;
    }


    // Put player's symbol

    board[index] = currentPlayer;

    clickedCell.textContent = currentPlayer;

    clickedCell.classList.add(
        currentPlayer.toLowerCase()
    );

    clickedCell.classList.add("taken");


    // Check result

    const result = checkWinner();


    if (result) {

        finishGame(result);

        return;
    }


    // Change player

    switchPlayer();
}


/* =====================================
   CHECK WINNER
===================================== */

function checkWinner() {

    for (
        const combination of winningCombinations
    ) {

        const first = combination[0];

        const second = combination[1];

        const third = combination[2];


        if (
            board[first] !== "" &&
            board[first] === board[second] &&
            board[first] === board[third]
        ) {

            return {
                type: "win",

                player: board[first],

                combination: combination
            };

        }

    }


    // Check draw

    if (!board.includes("")) {

        return {
            type: "draw"
        };

    }


    return null;
}


/* =====================================
   FINISH GAME
===================================== */

function finishGame(result) {

    gameActive = false;


    if (result.type === "win") {

        const winner = result.player;


        // Update score

        scores[winner]++;

        saveScore();

        updateScoreDisplay();


        // Highlight winning cells

        result.combination.forEach(index => {

            cells[index].classList.add("winner");

        });


        // Result message

        resultMessage.textContent =
            `Player ${winner} wins! 🎉`;


        resultMessage.className =
            "result-message " +
            `win-${winner.toLowerCase()}`;


        turnMessage.textContent =
            `Player ${winner} won the round`;


        updateTurnColor(winner);

    }


    else if (result.type === "draw") {

        scores.draws++;

        saveScore();

        updateScoreDisplay();


        resultMessage.textContent =
            "It's a draw! 🤝";


        resultMessage.className =
            "result-message draw";


        turnMessage.textContent =
            "Round ended in a draw";


        turnDot.style.background =
            "#b9b5ff";

        turnDot.style.boxShadow =
            "0 0 12px rgba(185, 181, 255, 0.7)";
    }
}


/* =====================================
   SWITCH PLAYER
===================================== */

function switchPlayer() {

    if (currentPlayer === "X") {

        currentPlayer = "O";

    } else {

        currentPlayer = "X";

    }


    turnMessage.textContent =
        `Player ${currentPlayer}'s move`;


    updateTurnColor(currentPlayer);
}


/* =====================================
   TURN COLOR
===================================== */

function updateTurnColor(player) {

    if (player === "X") {

        turnDot.style.background =
            "#ffb347";

        turnDot.style.boxShadow =
            "0 0 12px rgba(255, 179, 71, 0.7)";

    }

    else {

        turnDot.style.background =
            "#55ddea";

        turnDot.style.boxShadow =
            "0 0 12px rgba(85, 221, 234, 0.7)";
    }
}


/* =====================================
   NEW GAME
===================================== */

function startNewGame() {

    board = [
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        "",
        ""
    ];


    currentPlayer = "X";

    gameActive = true;


    // Clear cells

    cells.forEach(cell => {

        cell.textContent = "";

        cell.classList.remove(
            "x",
            "o",
            "taken",
            "winner"
        );

    });


    // Clear result

    resultMessage.textContent = "";

    resultMessage.className =
        "result-message";


    // Update turn

    turnMessage.textContent =
        "Player X's move";


    updateTurnColor("X");
}


/* =====================================
   RESET SCORE
===================================== */

function resetScore() {

    const confirmed = confirm(
        "Are you sure you want to reset all scores?"
    );


    if (!confirmed) {
        return;
    }


    scores = {
        X: 0,
        O: 0,
        draws: 0
    };


    saveScore();

    updateScoreDisplay();

    startNewGame();
}


/* =====================================
   EVENT LISTENERS
===================================== */

cells.forEach(cell => {

    cell.addEventListener(
        "click",
        handleCellClick
    );

});


newGameBtn.addEventListener(
    "click",
    startNewGame
);


resetBtn.addEventListener(
    "click",
    resetScore
);


/* =====================================
   START GAME
===================================== */

loadScore();

startNewGame();
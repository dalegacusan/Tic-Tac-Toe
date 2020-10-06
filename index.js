// MAIN GOAL: Have as little global code as possible!

/*
    [/] Separate each spot on the board to their distinct boxes.
    [/] Build the functions that allow players to add makrs to a spot on the board.
    [/] Build functions for displaying player names after form submit
    [/] Fix click addeventlistener targets to only target spots, not rows and the container.
    [/] Add logic that keeps players from playing in spots that are already taken.
    [/] Add check for winner logic
    [/] Make a efficient tie system (!!!BUG!!!)
    [/] Add modal for winner
    [/] Handle event after game winner
    [/] When closing modal, disable clicking of spots
    [] Add verification system for player names form
    [/] Make responsive

    [/] Play Again = Reset Board ONLY
    [/] Exit = Back to HOME SCREEN

    Finished core functionalities 10/2/2020
*/

const playersFormContainer = document.querySelector(".playersFormContainer");
const playerNamesContainer = document.querySelector(".playerNamesContainer");
const gameBoardContainer = document.querySelector(".gameBoard");
const playersForm = document.querySelector("#playersForm");
const gameBoardRow = document.querySelectorAll(".row");
const playerOneHeader = document.querySelector(".playerOne");
const playerTwoHeader = document.querySelector(".playerTwo");
const modal = document.getElementById("myModal");
const modalSpan = document.getElementsByClassName("close")[0];
const actionButtonsGameBoard = document.querySelector(".actionButtonsGameBoard");

let playerOne = null, playerTwo = null;
let activePlayer = "X";

const PlayerData = (playerName, letter) => {
    const playerLetter = letter;
    const displayPlayerName = () => playerName;

    return { playerLetter, displayPlayerName };
}

const domManipulation = (() => {
    const displayName = () => {
        if (activePlayer == "X") {
            playerOneHeader.classList.add("currentPlayer");
            playerTwoHeader.classList.remove("currentPlayer");
        } else {
            playerTwoHeader.classList.add("currentPlayer");
            playerOneHeader.classList.remove("currentPlayer");
        }
    }

    const showHideDisplay = (element, state) => {
        return element.style.display = state;
    };

    return {displayName, showHideDisplay};
})();

const GameBoard = ((checkWinner) => {  

    const {showHideDisplay} = domManipulation;

    const board = [
        ['&nbsp;', '&nbsp;', '&nbsp;'],
        ['&nbsp;', '&nbsp;', '&nbsp;'],
        ['&nbsp;', '&nbsp;', '&nbsp;']
    ];

    const renderBoard = (reRender) => {

        if (reRender) {
            for (let item of gameBoardRow) {
                item.innerHTML = "";
            }
        }

        showHideDisplay(gameBoardContainer, "block");

        for (let i = 0; i < board.length; i++) {
            const currentRow = board[i];
            for (let j = 0; j < currentRow.length; j++) {
                gameBoardRow[i].innerHTML += `<div class="row-${i} spot-${j} board-spot"><span>${currentRow[j]}</span></div>`;
            }
        }
        
        GameController.checkWinner();

    };

    const resetBoard = () => {
        for (let i = 0; i < board.length; i++) {
            const currentRow = board[i];
            for (let j = 0; j < currentRow.length; j++) {
                board[i][j] = '&nbsp;';
            }
        }

        renderBoard(true);
    }

    const gameBoardState = (enable) => {
        if(!enable) gameBoardContainer.classList.add('disabledGameboard');
        else gameBoardContainer.classList.remove('disabledGameboard')
    }

    return { board, renderBoard, resetBoard, gameBoardState };
})();

const GameController = (() => {

    const {board, renderBoard, resetBoard, gameBoardState} = GameBoard;
    const {displayName, showHideDisplay} = domManipulation;
    
    const resetGame = () => {
        activePlayer = "X";
        displayName();
    }

    const determinePosition = (row, spot, currentPlayer) => {
        for (let i = 0; i < board.length; i++) {
            if (i == row) {
                const currentRow = board[i];
                for (let j = 0; j < currentRow.length; j++) {
                    if (j == spot) {
                        board[i][j] = currentPlayer.playerLetter;
                        renderBoard(true);

                        activePlayer = activePlayer == "X" ? "O" : "X"; 
                        displayName();

                        break;
                    }
                }
            }
        }
    }

    const checkWinner = () => {
        let winner = "";

        // Horizontal
        if ((board[0][0] === "X" && board[0][1] === "X" && board[0][2] === "X") || ((board[0][0] === "O" && board[0][1] === "O" && board[0][2] === "O"))) winner = activePlayer;
        else if ((board[1][0] === "X" && board[1][1] === "X" && board[1][2] === "X") || (board[1][0] === "O" && board[1][1] === "O" && board[1][2] === "O")) winner = activePlayer;
        else if ((board[2][0] === "X" && board[2][1] === "X" && board[2][2] === "X") || (board[2][0] === "O" && board[2][1] === "O" && board[2][2] === "O")) winner = activePlayer;
        // Vertical
        else if ((board[0][0] === "X" && board[1][0] === "X" && board[2][0] === "X") || (board[0][0] === "O" && board[1][0] === "O" && board[2][0] === "O")) winner = activePlayer;
        else if ((board[0][1] === "X" && board[1][1] === "X" && board[2][1] === "X") || (board[0][1] === "O" && board[1][1] === "O" && board[2][1] === "O")) winner = activePlayer;
        else if ((board[0][2] === "X" && board[1][2] === "X" && board[2][2] === "X") || (board[0][2] === "O" && board[1][2] === "O" && board[2][2] === "O")) winner = activePlayer;
        // Diagonal
        else if ((board[0][0] === "X" && board[1][1] === "X" && board[2][2] === "X") || (board[0][0] === "O" && board[1][1] === "O" && board[2][2] === "O")) winner = activePlayer;
        else if ((board[0][2] === "X" && board[1][1] === "X" && board[2][0] === "X") || (board[0][2] === "O" && board[1][1] === "O" && board[2][0] === "O")) winner = activePlayer;
        // Tie
        else if (
            (board[0][0] === "X" || board[0][0] === "O") && (board[0][1] === "X" || board[0][1] === "O") && (board[0][2] === "X" || board[0][2] === "O")
            && (board[1][0] === "X" || board[1][0] === "O") && (board[1][1] === "X" || board[1][1] === "O") && (board[1][2] === "X" || board[1][2] === "O")
            && (board[2][0] === "X" || board[2][0] === "O") && (board[2][1] === "X" || board[2][1] === "O") && (board[2][2] === "X" || board[2][2] === "O")
            && (winner === "")) {
            winner = "tie";
        }

        // Check if winner has a value
        if (winner) handleGameResult(winner);
    }

    const handleGameResult = (result) => {
        const winnerContainer = document.querySelector(".winnerBody");
        const tieContainer = document.querySelector(".tieBody");
        const winnerText = document.querySelector("#winnerName");
        const loserText = document.querySelector("#loserName");
        const playAgainButtons = document.querySelectorAll(".playAgainButton");
        const exitButtons = document.querySelectorAll(".exitButton");

        showHideDisplay(modal, "block");

        // Disable gameboard
        gameBoardState(false);

        if (result === "tie") {
            showHideDisplay(winnerContainer, "none");
            showHideDisplay(tieContainer, "block");
        } else {
            showHideDisplay(winnerContainer, "block");
            showHideDisplay(tieContainer, "none");
            winnerText.innerText = playerOne.playerLetter === activePlayer ? playerOne.displayPlayerName() : playerTwo.displayPlayerName();
            loserText.innerText = playerOne.playerLetter !== activePlayer ? playerOne.displayPlayerName() : playerTwo.displayPlayerName();
        }

        playAgainButtons.forEach( button => {
            button.addEventListener("click", () => {
                showHideDisplay(actionButtonsGameBoard, "none");

                // Enable gameboard
                gameBoardState(true);
    
                resetGame();
                resetBoard();
                showHideDisplay(modal, "none");
            });
        });

        exitButtons.forEach( button => {
            button.addEventListener("click", () => {
                showHideDisplay(actionButtonsGameBoard, "none");

                // Clean Data
                playersForm.reset();
                resetGame();
                resetBoard();
                playerOne = null;
                playerTwo = null;
    
                // Hide elements
                showHideDisplay(modal, "none");
                showHideDisplay(playerNamesContainer, "none");
    
                // Show home screen
                showHideDisplay(playersFormContainer, "block");
    
                for (let item of gameBoardRow) {
                    item.innerHTML = "";
                }
    
                gameBoardState(true);
            });
        } );
        
    }

    // Add click event for each game board spot
    for (let row of gameBoardRow) {
        row.addEventListener("click", function (e) {
            const target = e.target;
            const coords = target.className.replace(/\D/g, '').split('');

            // Check if &nbsp;
            if (target.innerText == String.fromCharCode(160)) {
                // Check if target is div(spot)
                if (target !== "row") {
                    if (playerOne.playerLetter == activePlayer) {
                        determinePosition(coords[0], coords[1], playerOne);
                    } else {
                        determinePosition(coords[0], coords[1], playerTwo);
                    }
                }
            }
        });
    }

    return { checkWinner };

})();

// Handle form submission
playersForm.addEventListener("submit", (e) => {
    e.preventDefault();

    const formData = new FormData(e.target);
    const formPlayerOne = formData.get('playerOne');
    const formPlayerTwo = formData.get('playerTwo');
    const p1 = formPlayerOne.charAt(0).toUpperCase() + formPlayerOne.slice(1);
    const p2 = formPlayerTwo.charAt(0).toUpperCase() + formPlayerTwo.slice(1);

    playerOne = PlayerData(p1, "X");
    playerTwo = PlayerData(p2, "O");

    playersFormContainer.style.display = "none";
    playerNamesContainer.style.display = "block";

    playerOneHeader.innerHTML = `${playerOne.displayPlayerName()} (<span class="playerNameHighlight">X</span>)`;
    playerTwoHeader.innerHTML = `${playerTwo.displayPlayerName()} (<span class="playerNameHighlight">O</span>)`;
    
    GameBoard.renderBoard();

});

// Handle Modal
modalSpan.onclick = () => {
    modal.style.display = "none";
    actionButtonsGameBoard.style.display = "block";
};

const playerOne = {id: "Player One", name: "Player One", token: "X", score: 0};
const playerTwo = {id: "Player Two", name: "Player Two", token: "O", score: 0};

function setPlayerNames() {
  const playerTurnDiv = document.querySelector('.turn');
  // Player name modal form constants
  const playerNames = document.getElementById("setPlayerNames");
  const jsCloseBtn = playerNames.querySelector("#js-close");
  const normalCloseBtn = playerNames.querySelector("#normal-close");
  playerNames.showModal();

  normalCloseBtn.addEventListener("click", (e) => {
    // Set player one name
    if (player1.value != "") {
      document.querySelector('.playerOne').innerHTML = player1.value + " (X) " + playerOne.score
      playerOne.name = player1.value
      playerTurnDiv.textContent = `${playerOne.name}'s turn...`;
    }
    // Set player two name
    if (player2.value != "") {
      document.querySelector('.playerTwo').innerHTML = player2.value + " (O) " + playerTwo.score
      playerTwo.name = player2.value;
    }
    playerNames.close();
  })

  // Close and cancel the modal add book form
  jsCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playerNames.close();
  })

}

function Gameboard() {
  const rows = 3;
  const columns = 3;
  const board = [];

  for (let i = 0; i < rows; i++) {
    board[i] = [];
    for (let j = 0; j < columns; j++) {
      board[i].push(Cell());
    }
  }

  const getBoard = () => board;

  const dropToken = (row, column, player) => {
    board[row][column].addToken(player);
    }
  
  const clearBoard = () => {
    for (let i = 0; i < rows; i++) {
      board[i] = [];
      for (let j = 0; j < columns; j++) {
        board[i].push(Cell());
      }
    }
    const boardDiv = document.querySelector('.board');
    boardDiv.textContent = "";
    var rowNumber = -1;
    board.forEach(row => {
      rowNumber = ++rowNumber;
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.dataset.row = rowNumber;
        cellButton.textContent = "";
        cell.value = "";
        boardDiv.appendChild(cellButton);
      })
    })  
  }

  return { getBoard, dropToken, clearBoard };
}

function Cell() {
  let value = "";

  const addToken = (player) => {
    value = player;
  };

  const getValue = () => value;

  return {
    addToken,
    getValue
  };
}

function GameController(
  playerOneName = "Player One",
  playerTwoName = "Player Two"
) {
  const board = Gameboard();
  const clearBoard = board.clearBoard;

  const players = [ 
    {
      name: playerOneName,
      token: "X"
    },
    {
      name: playerTwoName,
      token: "O"
    }
  ];

  let activePlayer = players[0];

  const switchPlayerTurn = () => {
    activePlayer = activePlayer === players[0] ? players[1] : players[0];
  };
  const getActivePlayer = () => activePlayer;

  const playRound = (row, column) => {
    function getRandomInt(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min + 1) + min);
    }

    board.dropToken(row, column, getActivePlayer().token);
    switchPlayerTurn();
  };

  return {
    playRound,
    getActivePlayer,
    getBoard: board.getBoard,
    clearBoard
  };
}

function ScreenController() {
  const game = GameController();
  const playerTurnDiv = document.querySelector('.turn');
  const winningMessageModal = document.getElementById('winner');
  const boardDiv = document.querySelector('.board');
  let currentPlayerName = "";

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    if (activePlayer.name === "Player One") {
      currentPlayerName = playerOne.name;
    } else currentPlayerName = playerTwo.name;
    playerTurnDiv.textContent = `${currentPlayerName}'s turn...`

    // Render board squares
    var rowNumber = -1;
    board.forEach(row => {
      rowNumber = ++rowNumber;
      row.forEach((cell, index) => {
        const cellButton = document.createElement("button");
        cellButton.classList.add("cell");
        cellButton.dataset.column = index;
        cellButton.dataset.row = rowNumber;
        cellButton.textContent = cell.getValue();
        if (cellButton.textContent === "X") {
          cellButton.style.color = "red";
        } else cellButton.style.color = "blue";
        boardDiv.appendChild(cellButton);
      })
    })
  }

  // Add event listener for the board
  function clickHandlerBoard(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
    // Make sure a cell is clicked and not the gaps in between
    if (!selectedColumn || !selectedRow) return;
    // Check if the cell already contains something
    var tokenCell = document.querySelector("[data-column='" + selectedColumn + "'][data-row='" + selectedRow + "']");
    if(tokenCell.innerHTML !== "") {
      // Display modal cell already contains a value dialog
      const cellContainsValueDialog = document.getElementById('cellContainsValueDialog')
      cellContainsValueDialog.showModal()
      cellContainsValueDialog.addEventListener('click', (event) => {
      }, { once: true })
      e.preventDefault();
      return;
    }
    game.playRound(selectedRow, selectedColumn);
    updateScreen();
    checkForWinner();
    let checkGameOver = checkForWinner();
    if (checkGameOver != undefined) {
      if (checkGameOver === "Player One") {
        playerOne.score++
        document.querySelector('.playerOne').innerHTML = playerOne.name + " (" + playerOne.token + ") " + playerOne.score;
      } else if (checkGameOver === "Player Two") {
        playerTwo.score++
        document.querySelector('.playerTwo').innerHTML = playerTwo.name + " (" + playerTwo.token + ") " + playerTwo.score;
      }
      // Display modal game over dialog
      const gameOverDialog = document.getElementById('gameOverDialog')
      gameOverDialog.showModal()
      gameOverDialog.addEventListener('click', (event) => {
        let element = event.target;
        if (element.textContent === "New Game") {
          game.clearBoard()
          checkGameOver = "";
        } else location.reload();     
      }, { once: true })
      e.preventDefault();
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  function checkForWinner() {
    let winningPlayer = "";
    let winningPlayerID = "";
    const boardValues = document.querySelectorAll(".cell");
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    if (activePlayer.name === "Player One") {
       winningPlayer = playerTwo.name
       winningPlayerID = playerTwo.id;
    } else {
        winningPlayer = playerOne.name
        winningPlayerID = playerOne.id;
    }

    // Check for a win on the 3 horizontal rows
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[1].textContent && boardValues[0].textContent === boardValues[2].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal top!`
        return winningPlayerID;
    } else if (boardValues[3].textContent != "" && boardValues[3].textContent === boardValues[4].textContent && boardValues[3].textContent === boardValues[5].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal middle!`
        return winningPlayerID;
        } else if (boardValues[6].textContent != "" && boardValues[6].textContent === boardValues[7].textContent && boardValues[6].textContent === boardValues[8].textContent) {
            winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal bottom!`
            return winningPlayerID;
            }

    // Check for a win on the 3 vertical rows
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[3].textContent && boardValues[0].textContent === boardValues[6].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with vertical left!`
        return winningPlayerID;
    } else if (boardValues[1].textContent != "" && boardValues[1].textContent === boardValues[4].textContent && boardValues[1].textContent === boardValues[7].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with vertical middle!`
        return winningPlayerID;
        } else if (boardValues[2].textContent != "" && boardValues[2].textContent === boardValues[5].textContent && boardValues[2].textContent === boardValues[8].textContent) {
            winningMessageModal.innerHTML = `${winningPlayer} wins with vertical right!`
            return winningPlayerID;
            }

    // Check for a win on the left diagonal
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[4].textContent && boardValues[0].textContent === boardValues[8].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with diagonal top left!`
        return winningPlayerID;
    }

    // Check for a win on the right diagonal
    if (boardValues[2].textContent != "" && boardValues[2].textContent === boardValues[4].textContent && boardValues[2].textContent === boardValues[6].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with diagonal top right!`
        return winningPlayerID;
    } else {
        // If all cells used and no winner, it's a draw
        if (boardValues[0].textContent != "" && boardValues[1].textContent != "" && boardValues[2].textContent != "" && boardValues[3].textContent != "" &&
        boardValues[4].textContent != "" && boardValues[5].textContent != "" && boardValues[6].textContent != "" && boardValues[7].textContent != "" &&
        boardValues[8].textContent != "" ) {
          winningMessageModal.innerHTML = `It's a draw`
          return "Draw";
        }     
    }

  }

  // Initial render
  updateScreen();
}

setPlayerNames();
ScreenController();

let playerOneScore= 0;
let playerTwoScore = 0;

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
  };

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

  const updateScreen = () => {
    // clear the board
    boardDiv.textContent = "";

    // get the newest version of the board and player turn
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();

    // Display player's turn
    playerTurnDiv.textContent = `${activePlayer.name}'s turn...`

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
        playerOneScore++ 
        document.querySelector('.playerOne').innerHTML = "Player One " + playerOneScore;
      } else {
        playerTwoScore++
        document.querySelector('.playerTwo').innerHTML = "Player Two " + playerTwoScore;
      }
      // Display modal game over dialog
      const gameOverDialog = document.getElementById('gameOverDialog')
      gameOverDialog.showModal()
      gameOverDialog.addEventListener('click', (event) => {
        let element = event.target;
        if (element.textContent === "New Game") {
          game.clearBoard()
          winningMessageDiv.textContent = ""
          checkGameOver = "";
        } else location.reload();     
      }, { once: true })
      e.preventDefault();
    }
  }

  boardDiv.addEventListener("click", clickHandlerBoard);

  function checkForWinner() {
    let winningPlayer = "";
    const boardValues = document.querySelectorAll(".cell");
    const board = game.getBoard();
    const activePlayer = game.getActivePlayer();
    if (activePlayer.name === "Player One") {
       winningPlayer = "Player Two";
    } else winningPlayer = "Player One";

    // Check for a win on the 3 horizontal rows
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[1].textContent && boardValues[0].textContent === boardValues[2].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal top!`
        return winningPlayer;
    } else if (boardValues[3].textContent != "" && boardValues[3].textContent === boardValues[4].textContent && boardValues[3].textContent === boardValues[5].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal middle!`
        return winningPlayer;
        } else if (boardValues[6].textContent != "" && boardValues[6].textContent === boardValues[7].textContent && boardValues[6].textContent === boardValues[8].textContent) {
            winningMessageModal.innerHTML = `${winningPlayer} wins with horizontal bottom!`
            return winningPlayer;
            }

    // Check for a win on the 3 vertical rows
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[3].textContent && boardValues[0].textContent === boardValues[6].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with vertical left!`
        return winningPlayer;
    } else if (boardValues[1].textContent != "" && boardValues[1].textContent === boardValues[4].textContent && boardValues[1].textContent === boardValues[7].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with vertical middle!`
        return winningPlayer;
        } else if (boardValues[2].textContent != "" && boardValues[2].textContent === boardValues[5].textContent && boardValues[2].textContent === boardValues[8].textContent) {
            winningMessageModal.innerHTML = `${winningPlayer} wins with vertical right!`
            return winningPlayer;
            }

    // Check for a win on the left diagonal
    if (boardValues[0].textContent != "" && boardValues[0].textContent === boardValues[4].textContent && boardValues[0].textContent === boardValues[8].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with diagonal top left!`
        return winningPlayer;
    }

    // Check for a win on the right diagonal
    if (boardValues[2].textContent != "" && boardValues[2].textContent === boardValues[4].textContent && boardValues[2].textContent === boardValues[6].textContent) {
        winningMessageModal.innerHTML = `${winningPlayer} wins with diagonal top right!`
        return winningPlayer;
    }

  }

  // Initial render
  updateScreen();
}

ScreenController();

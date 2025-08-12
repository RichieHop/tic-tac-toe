let winningLine = "";
let board = [["", "", ""],["", "", ""],["", "", ""]];

const winningMessageModal = document.getElementById('winner');
const playerTurnDiv = document.querySelector('.turn');
const players = [
  {id: "Player One", name: "Player One", token: "X", score: 0},
  {id: "Player Two", name: "Computer", token: "O", score: 0}
]

let currentPlayer = players[0].name;
let currentToken = players[0].token;

gameBoard().initialiseBoard();

setPlayerNames();

// ******************************************************************************************

function setPlayerNames() {
  // Player name modal form constants
  const playerNames = document.getElementById("setPlayerNames");
  const jsCloseBtn = playerNames.querySelector("#js-close");
  const normalCloseBtn = playerNames.querySelector("#normal-close");

  playerNames.showModal();

  normalCloseBtn.addEventListener("click", (e) => {
    // Set player one name
    if (player1.value != "") {
      players[0].name = player1.value;
      currentPlayer = players[0].name
      document.querySelector('.playerOne').innerHTML = players[0].name + " (X) " + players[0].score;
      playerTurnDiv.textContent = `${players[0].name}'s turn...`;
    }
    // Set player two name
    if (player2.value != "") {
      players[1].name = player2.value;
      document.querySelector('.playerTwo').innerHTML = players[1].name + " (O) " + players[1].score;
    }
    playerNames.close();
  })

  // Close and cancel the modal players form
  jsCloseBtn.addEventListener("click", (e) => {
    e.preventDefault();
    playerNames.close();
  })

}

// ******************************************************************************************

function gameBoard() {

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1) + min);
  }

  const playerMove = (row, column, token) => {
    board[row][column] = token;
    // Loop through the board array and add the values to the screen
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cellHTML = document.querySelector('[data-row="' + i + '"][data-column="' + j + '"]');
        cellHTML.textContent = board[i][j];
      }
    }
  }

  const checkForWin = () => {
    if (gameController().isWin(board)) {
      console.log(winningMessageModal);
      if (winningMessageModal.textContent !== "It's a draw") {
        if (currentPlayer === players[0].name) {
          players[0].score++;
          document.querySelector('.playerOne').innerHTML = players[0].name + " (" + players[0].token + ") " + players[0].score;
        } else {
          players[1].score++;
          document.querySelector('.playerTwo').innerHTML = players[1].name + " (" + players[1].token + ") " + players[1].score;
        }
      }
      // Display modal game over dialog
      const gameOverDialog = document.getElementById('gameOverDialog')
      gameOverDialog.showModal()
      gameOverDialog.addEventListener('click', (event) => {
        let element = event.target;
        if (element.textContent === "New Game") {
          initialiseBoard()
        } else location.reload();     
      }, { once: true })
      // e.preventDefault();
      return "Winner";
    }
  }

  // Initialise the board
  const initialiseBoard = () => {
    board = [["", "", ""],["", "", ""],["", "", ""]];
    // Loop through the board array and add the values to the screen
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 3; j++) {
        let cellHTML = document.querySelector('[data-row="' + i + '"][data-column="' + j + '"]');
        cellHTML.textContent = board[i][j];
        // Add event listeners for board cell
        cellHTML.addEventListener("click", clickHandlerCell);
      }
    }
  }

  function clickHandlerCell(e) {
    const selectedColumn = e.target.dataset.column;
    const selectedRow = e.target.dataset.row;
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

    // Place the token in the clicked cell
    playerMove(selectedRow, selectedColumn, currentToken);
    const isWinner = checkForWin();
    if (isWinner !== "Winner" && players[1].name === "Computer") {
      gameController().switchPlayerTurn();
      // Auto generate the computer move
      let moveRow = 0, moveColumn = 0;
      do {
        moveRow = getRandomInt(0, 2);
        moveColumn = getRandomInt(0, 2);
        // Check if the cell already contains something
        var tokenCell = document.querySelector("[data-column='" + moveColumn + "'][data-row='" + moveRow + "']");
      } while (tokenCell.innerHTML !== "");
      playerMove(moveRow, moveColumn, currentToken);
      checkForWin();
      gameController().switchPlayerTurn();
    } else if (isWinner !== "Winner" && players[1].name !== "Computer") {
        gameController().switchPlayerTurn();
    }

  }

  return { playerMove, checkForWin, initialiseBoard };

}

// ******************************************************************************************

function gameController() {

  // Check the horizontal, vertical and diagonal rows for 3 matching tokens
  function checkVertical(board){
    for(i = 0; i < 3; ++i) {
      if (board[0][i] !== "" && board[0][i] === board[1][i] && board[0][i] === board[2][i]) {
        winningLine = `${board[0][i]} in column ${i} vertical.`;
        winningMessageModal.innerHTML = `${currentPlayer} wins with vertical row!`
        return true;}
      }
    return false;
  }

  function checkHorizontal(board){
    for(i = 0; i < 3; ++i) {
      if (board[i][0] !== "" && board[i][0] === board[i][1] && board[i][0] === board[i][2]) {
        winningLine = `${board[0][i]} in row ${i} horizontal.`;
        winningMessageModal.innerHTML = `${currentPlayer} wins with horizontal row!`
        return true;}
      }
    return false;
  }

  function checkDiagonalLeft(board){
    if (board[0][0] !== "" && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      winningLine = `${board[0][0]} in left diagonal.`;
      winningMessageModal.innerHTML = `${currentPlayer} wins with diagonal left!`
      return true;}  
    return false;
  }

  function checkDiagonalRight(board){
    if (board[0][2] !== "" && board[0][2] === board[1][1] && board[0][2] === board[2][0]) {
      winningLine = `${board[0][2]} in right diagonal.`;
      winningMessageModal.innerHTML = `${currentPlayer} wins with diagonal right!`
      return true;
    }    
    return false;
  }

  function checkForDraw(board) {
    // If all cells used and no winner, it's a draw
    if (!board[0].includes("") && !board[1].includes("") && !board[2].includes("") ) {
      winningMessageModal.innerHTML = `It's a draw`
      return true;
    }
  }

  function isWin(board) {
  return checkVertical(board) 
    || checkHorizontal(board)
    || checkDiagonalLeft(board)
    || checkDiagonalRight(board)
    || checkForDraw(board);
  }

  const switchPlayerTurn = () => {
    if (currentPlayer === players[0].name) {
      playerTurnDiv.textContent = `${players[1].name}'s turn...`;
      currentPlayer = players[1].name
      currentToken = players[1] .token;
    } else {
      playerTurnDiv.textContent = `${players[0].name}'s turn...`;
      currentPlayer = players[0].name
      currentToken = players[0] .token;
    }
  };

return { winningLine, isWin, switchPlayerTurn };

}
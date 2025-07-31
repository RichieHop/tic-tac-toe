let currentToken = "X";

// References to table cells
const cell0 = document.getElementById("cell0");
const cell1 = document.getElementById("cell1");
const cell2 = document.getElementById("cell2");
const cell3 = document.getElementById("cell3");
const cell4 = document.getElementById("cell4");
const cell5 = document.getElementById("cell5");
const cell6 = document.getElementById("cell6");
const cell7 = document.getElementById("cell7");
const cell8 = document.getElementById("cell8");

// Add event listeners for the cells
cell0.addEventListener("click", () => {
  // *******************************************************************************
  // Ensure cell doesn't already contain an X or an O
  // *******************************************************************************
    board[0][0] = currentToken;
    cell0.innerHTML = currentToken;
    if (currentToken === "X") {currentToken = "O"} else currentToken = "X";
    checkHorizontal(board);
})
cell1.addEventListener("click", () => {
    board[0][1] = currentToken;
    cell1.innerHTML = currentToken;
    if (currentToken === "X") {currentToken = "O"} else currentToken = "X";
    checkHorizontal(board);
})
cell2.addEventListener("click", () => {
    board[0][2] = currentToken;
    cell2.innerHTML = currentToken;
    if (currentToken === "X") {currentToken = "O"} else currentToken = "X";
    checkHorizontal(board);
})

// Board setup
var createBoard = function (boardRow, boardColumn) {
  var result = Array(boardRow);
  for (var i=0; i<boardRow; i++) {
      result[i] = Array(boardColumn);
  }
  return result;
};

// Create the board
var board = createBoard(3, 3);

// Check for a win on the 3 horizontal rows
function checkHorizontal(board) {
  var symbol = "";
  if (board[0][0] != undefined && board[0][0] === board[0][1] && board[0][0] === board[0][2]) {
      console.log(symbol = board[0][0] + " wins with horizontal top")
      return symbol;
  } else if (board[1][0] != undefined && board[1][0] === board[1][1] && board[1][0] === board[1][2]) {
      console.log(symbol = board[1][0] + " wins with horizontal middle")
      return symbol;
      } else if (board[2][0] != undefined && board[2][0] === board[2][1] && board[2][0] === board[2][2]) {
          console.log(symbol = board[2][0] + " wins with horizontal bottom")
          return symbol;
          }
          else {
              return "";
          }
}

// Check for a win on the left diagonal
function checkDiagonalLeft(board) {
  var symbol = "";
  if (board[0][0] != undefined && board[0][0] === board[1][1] && board[0][0] === board[2][2]) {
      symbol = board[0][0] + " wins with diagonal starting top left"
      return symbol;
  } else {
      return "";
  }
}

// Check for a win on the right diagonal
function checkDiagonalRight(board) {
  var symbol = "";
  if (board[0][2] != undefined && board[0][2] === board[1][1] && board[2][0] === board[0][2]) {
      symbol = board[0][2] + " wins with diagonal starting top right"
      return symbol;
  } else {
      return "";
  }
}

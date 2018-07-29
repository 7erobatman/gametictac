// 1.basic setup
// 2.Determine winner
// Basic AI and winner notification
// 4.MiniMax algorithm!
let originBoard; //table item array
const human_player = "O"; //user element
const ai_player = "X"; //machime element
const winCombos = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6]
]; //winning combination
const cells = document.querySelectorAll(".cell"); //cells object contain all cell class
//console.log(typeof cells);
//console.log(cells.length);
startGame(); //function call

function startGame() {
  document.querySelector(".endgame").style.display = "none"; //to sure at beginning it not show anything on board
  originBoard = Array.from(Array(9).keys()); //initialize originBoard with number 0 to 9
  //console.log(originBoard);
  for (let i = 0; i < cells.length; i++) {
    cells[i].innerText = "";
    cells[i].style.removeProperty("background-color");
    cells[i].addEventListener("click", turnClick, false); //add event on click and call turnClick function
  }
}
function turnClick(dot) {
  // not click where it already click
  if (typeof originBoard[dot.target.id] == "number") {
    // dot give every information and we choose specifically only id from it
    // console.log(dot.target.id);
    turn(dot.target.id, human_player);
    if (!checkTie()) {
      turn(bestSpot(), ai_player);
    }
  }
}
function turn(dotId, player) {
  // console.log(dotId);
  // console.log(player);
  originBoard[dotId] = player;
  document.getElementById(dotId).innerText = player;
  let gameWon = checkWin(originBoard, player);
  if (gameWon) {
    gameOver(gameWon);
  }
}

function checkWin(board, player) {
  let plays = board.reduce((a, e, i) => (e === player ? a.concat(i) : a), []);
  let gameWon = null;
  for (let [index, win] of winCombos.entries()) {
    if (win.every(elem => plays.indexOf(elem) > -1)) {
      gameWon = { index: index, player: player };
      break;
    }
  }
  return gameWon;
}

function gameOver(gameWon) {
  for (let index of winCombos[gameWon.index]) {
    document.getElementById(index).style.backgroundColor =
      gameWon.player == human_player ? "blue" : "red";
  }
  for (let i = 0; i < cells.length; i++) {
    cells[i].removeEventListener("click", turnClick, false);
  }
  delcareWinner(gameWon.player == human_player ? "you win" : "you lose");
}

function delcareWinner(who) {
  document.querySelector(".endgame").style.display = "block";
  document.querySelector(".endgame .text").innerText = who;
}

function emptySquare() {
  return originBoard.filter(s => typeof s == "number");
}

function bestSpot() {
  return minimax(originBoard, ai_player).index;
}

function checkTie() {
  if (emptySquare().length == 0) {
    for (let i = 0; i < cells.length; i++) {
      cells[i].style.backgroundColor = "#86c232";
      cells[i].removeEventListener("click", turnClick, false);
    }
    delcareWinner("Tie Game!");
    return true;
  }
  return false;
}

function minimax(newBoard, player) {
  var availSpots = emptySquare(newBoard);

  if (checkWin(newBoard, human_player)) {
    return { score: -10 };
  } else if (checkWin(newBoard, ai_player)) {
    return { score: 10 };
  } else if (availSpots.length === 0) {
    return { score: 0 };
  }
  var moves = [];
  for (var i = 0; i < availSpots.length; i++) {
    var move = {};
    move.index = newBoard[availSpots[i]];
    newBoard[availSpots[i]] = player;

    if (player == ai_player) {
      var result = minimax(newBoard, human_player);
      move.score = result.score;
    } else {
      var result = minimax(newBoard, ai_player);
      move.score = result.score;
    }

    newBoard[availSpots[i]] = move.index;

    moves.push(move);
  }

  var bestMove;
  if (player === ai_player) {
    var bestScore = -10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score > bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  } else {
    var bestScore = 10000;
    for (var i = 0; i < moves.length; i++) {
      if (moves[i].score < bestScore) {
        bestScore = moves[i].score;
        bestMove = i;
      }
    }
  }

  return moves[bestMove];
}

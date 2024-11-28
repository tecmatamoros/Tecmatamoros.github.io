// script.js
let player1, player2, symbol1, symbol2, mode, board, turn, scores, currentPlayer;

function startGame(selectedMode) {
  player1 = document.getElementById("player1Name").value || "Jugador 1";
  player2 = selectedMode === "ai" ? "IA" : (document.getElementById("player2Name").value || "Jugador 2");
  symbol1 = document.getElementById("symbol1").value;
  symbol2 = document.getElementById("symbol2").value;
  mode = selectedMode;
  scores = { player1: 0, player2: 0 };
  resetBoard();
  document.getElementById("menu").style.display = "none";
  document.getElementById("game").style.display = "block";
  updateScoreDisplay();
  updateTurnText();
}

function resetBoard() {
  board = ["", "", "", "", "", "", "", "", ""];
  turn = 0;
  currentPlayer = player1;
  document.querySelectorAll(".cell").forEach(cell => {
    cell.textContent = "";
    cell.classList.remove("winning");
  });
}

function makeMove(index) {
  if (board[index] !== "") return;

  const symbol = currentPlayer === player1 ? symbol1 : symbol2;
  board[index] = symbol;
  document.querySelectorAll(".cell")[index].textContent = symbol;

  if (checkWin()) {
    alert(`${currentPlayer} ha ganado!`);
    currentPlayer === player1 ? scores.player1++ : scores.player2++;
    updateScoreDisplay();
    resetBoard();
  } else if (board.every(cell => cell !== "")) {
    alert("¡Empate!");
    resetBoard();
  } else {
    nextTurn();
  }
}

function nextTurn() {
  turn++;
  currentPlayer = turn % 2 === 0 ? player1 : player2;
  if (mode === "ai" && currentPlayer === "IA") {
    setTimeout(() => {
      const bestMove = getBestMove();
      makeMove(bestMove);
    }, 500);
  }
  updateTurnText();
}

// Algoritmo Minimax optimizado para la IA más "humana"
function minimax(newBoard, depth, isMaximizing) {
  const scores = { [symbol1]: -10, [symbol2]: 10, tie: 0 };

  const winner = getWinner(newBoard);
  if (winner !== null) {
    return scores[winner];
  }

  if (newBoard.every(cell => cell !== "")) {
    return scores.tie;
  }

  let bestScore = isMaximizing ? -Infinity : Infinity;

  for (let i = 0; i < newBoard.length; i++) {
    if (newBoard[i] === "") {
      newBoard[i] = isMaximizing ? symbol2 : symbol1;
      let score = minimax(newBoard, depth + 1, !isMaximizing);
      newBoard[i] = "";

      if (isMaximizing) {
        bestScore = Math.max(score, bestScore);
      } else {
        bestScore = Math.min(score, bestScore);
      }
    }
  }

  return bestScore;
}

// Obtener el mejor movimiento para la IA con una pequeña probabilidad de fallo
function getBestMove() {
  let bestScore = -Infinity;
  let move;

  let bestMoves = [];

  // Evaluar todas las jugadas posibles
  for (let i = 0; i < board.length; i++) {
    if (board[i] === "") {
      board[i] = symbol2;
      let score = minimax(board, 0, false);
      board[i] = "";

      // Almacenar la mejor jugada o jugadas con la puntuación más alta
      if (score > bestScore) {
        bestScore = score;
        bestMoves = [i];
      } else if (score === bestScore) {
        bestMoves.push(i);
      }
    }
  }

  // Introducir un pequeño error en la jugada de la IA
  if (bestMoves.length > 1) {
    // Elegir una jugada aleatoria de las mejores jugadas
    const randomIndex = Math.random();
    if (randomIndex < 0.7) {
      // 10% de probabilidad de hacer una jugada no óptima
      const randomMove = Math.floor(Math.random() * board.length);
      return board[randomMove] === "" ? randomMove : bestMoves[0];
    }
  }

  return bestMoves[Math.floor(Math.random() * bestMoves.length)];
}

function checkWin() {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];
  return winningCombinations.some(combination => {
    const [a, b, c] = combination;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      combination.forEach(index => document.querySelectorAll(".cell")[index].classList.add("winning"));
      return true;
    }
    return false;
  });
}

// Obtener el ganador del tablero (revisado)
function getWinner(board) {
  const winningCombinations = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  for (const [a, b, c] of winningCombinations) {
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return board[a];
    }
  }

  return null;
}

function updateScoreDisplay() {
  document.getElementById("score1").textContent = `${player1}: ${scores.player1}`;
  document.getElementById("score2").textContent = `${player2}: ${scores.player2}`;
}

function updateTurnText() {
  document.getElementById("turn").textContent = `Turno de: ${currentPlayer}`;
}

function showCredits() {
  document.getElementById("menu").style.display = "none";
  document.getElementById("credits").style.display = "block";
}

function goToMenu() {
  document.getElementById("menu").style.display = "block";
  document.getElementById("credits").style.display = "none";
  document.getElementById("game").style.display = "none";
}

let difficulty_easy = false;

const boardCells = document.querySelectorAll('.cell');
const currentBoard = Array(9).fill(0); // Initialize the board state with -1 (empty cells)

function resetBoard() {
    boardCells.forEach(cell => {
        cell.textContent = '';
        cell.classList.remove('occupied');
    });

    currentBoard.fill(0);
}

function endGame() {
    boardCells.forEach(cell =>{
        cell.classList.add('occupied');
    });
}

function checkWin(board, player) {
    const winCombinations = [
        [0, 1, 2], [3, 4, 5], [6, 7, 8], // Rows
        [0, 3, 6], [1, 4, 7], [2, 5, 8], // Columns
        [0, 4, 8], [2, 4, 6] // Diagonals
    ];

    for (const combination of winCombinations) {
        const [a, b, c] = combination;
        if (board[a] === player && board[b] === player && board[c] === player) {
            return true;
        }
    }

    return false;
}

document.addEventListener('DOMContentLoaded', function() {
    let turn = 1;

    boardCells.forEach((cell, index) => {
        cell.addEventListener('click', function() {
            if (!cell.classList.contains('occupied')) {
                const move = index;

                if (turn === 1) {
                    currentBoard[move] = 1; // Update the board state for player's move
                    cell.textContent = 'X';
                }

                const player_turn = turn;

                cell.classList.add('occupied');

                // Make an AJAX POST request to the Flask server to play the player's move
                fetch('/api/play', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ turn: player_turn, board: currentBoard })
                })
                .then(response => {
                    if (!response.ok) {
                        throw new Error('Network response was not ok');
                    }
                    return response.json();
                })
                .then(data => {
                    const botMove = data.bot_move;
                    currentBoard[botMove] = 2; // Update the board state for bot's move

                    const botCell = boardCells[botMove];
                    botCell.textContent = 'O';
                    botCell.classList.add('occupied');

                    if (checkWin(currentBoard, 2)) {
                        endGame();
                    }
                })
                .catch(error => console.error('Error:', error));
            }
        });
    });
});




const difficultyToggleButton = document.getElementById('difficulty-button');

difficultyToggleButton.addEventListener('click', function() {

    difficultyToggleButton.classList.toggle('green');
    difficulty_easy = !difficulty_easy;

    if (difficulty_easy)
        difficultyToggleButton.textContent = "Mode - Easy";
    else
        difficultyToggleButton.textContent = "Mode - Hard";
});
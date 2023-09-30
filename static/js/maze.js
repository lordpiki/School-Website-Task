// Function to generate a maze using Recursive Backtracking algorithm
let generalMaze;
let playerRow = 0;
let playerCol = 0;

// Listen for the slider value change event
const slider = document.getElementById('maze-size-slider');
slider.addEventListener('input', updateMazeSize);

const defaultSize = 15;
var maze = generateMaze(defaultSize, defaultSize);


maze[0][0].player_visited = true;


function generateMaze(rows, cols) {
  // Initialize the maze grid
  
  playerRow = 0;
  playerCol = 0;
  const maze = [];


  for (let i = 0; i < rows; i++) {
    maze.push([]);
    for (let j = 0; j < cols; j++) {
      maze[i].push({
        top: true,
        right: true,
        bottom: true,
        left: true,
        visited: false,
        solution: false,
        player_visited: false
      });
    }
  }


  // Recursive Backtracking algorithm
  function visitCell(row, col) {
    maze[row][col].visited = true;
    const directions = shuffleDirections();

    for (const direction of directions) {
      const newRow = row + direction[0];
      const newCol = col + direction[1];

      if (newRow >= 0 && newRow < rows && newCol >= 0 && newCol < cols && !maze[newRow][newCol].visited) {
        // Remove walls between the current cell and the new cell
        if (direction[0] === -1) { // Top
          maze[row][col].top = false;
          maze[newRow][newCol].bottom = false;
        } else if (direction[0] === 1) { // Bottom
          maze[row][col].bottom = false;
          maze[newRow][newCol].top = false;
        } else if (direction[1] === -1) { // Left
          maze[row][col].left = false;
          maze[newRow][newCol].right = false;
        } else if (direction[1] === 1) { // Right
          maze[row][col].right = false;
          maze[newRow][newCol].left = false;
        }

        visitCell(newRow, newCol);
      }
    }
  }

  // Shuffle an array of directions
  function shuffleDirections() {
    const directions = [[-1, 0], [1, 0], [0, -1], [0, 1]];
    return directions.sort(() => Math.random() - 0.5);
  }

  // Start generating the maze from the top-left cell
  visitCell(0, 0);

  renderMaze(maze)
  generalMaze = maze;
  
  return maze;

}


function renderMaze(maze) {
  
  const mazeContainer = document.getElementById('maze-container');
  let rows = maze.length;
  let cols = rows;
  


  mazeContainer.style.setProperty('--rows', rows); // Set CSS variable for rows
  mazeContainer.style.setProperty('--cols', cols); // Set CSS variable for columns
  mazeContainer.innerHTML = ''; // Clear the maze container if needed
  // Loop through the maze array and create HTML elements to represent walls and paths
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      const cell = maze[i][j];

      const cellDiv = document.createElement('div');
      cellDiv.className = 'cell';

      if (i === 0 && j === 0) {
        cellDiv.classList.add('start-point');
      } else if (i === rows - 1 && j === cols - 1) {
        cellDiv.classList.add('end-point');
      } else if (cell.solution)
        cellDiv.classList.add('solution-path');
      else if (cell.player_visited)
        cellDiv.classList.add('visited');


      if (cell.top) cellDiv.classList.add('wall-top');
      if (cell.right) cellDiv.classList.add('wall-right');
      if (cell.bottom) cellDiv.classList.add('wall-bottom');
      if (cell.left) cellDiv.classList.add('wall-left');

      if (localStorage.getItem('darkMode') === 'true') {
        cellDiv.classList.toggle('dark-mode');
      }


      mazeContainer.appendChild(cellDiv);
    }
  }
}

function solveMaze() {
  let maze = generalMaze;
  const rows = maze.length;
  const cols = maze[0].length;
  const visited = Array.from({ length: rows }, () => Array(cols).fill(false));

  function dfs(row, col) {
    if (row < 0 || row >= rows || col < 0 || col >= cols || visited[row][col]) {
      return false;
    }

    visited[row][col] = true;

    if (row === rows - 1 && col === cols - 1) {
      maze[row][col].solution = true;
      // Mark the cell as part of the solution
      return true; // Found the exit
    }

    // Explore adjacent cells
    if (!maze[row][col].top && dfs(row - 1, col)) {
      maze[row][col].solution = true;
      // Mark the cell as part of the solution
      return true; // Top
    }
    if (!maze[row][col].right && dfs(row, col + 1)) {
      maze[row][col].solution = true; // Mark the cell as part of the solution
      return true; // Right
    }
    if (!maze[row][col].bottom && dfs(row + 1, col)) {
      maze[row][col].solution = true; // Mark the cell as part of the solution
      return true; // Bottom
    }
    if (!maze[row][col].left && dfs(row, col - 1)) {
      maze[row][col].solution = true; // Mark the cell as part of the solution
      return true; // Left
    }

    return false;
  }

  // Start solving the maze from the top-left cell
  dfs(0, 0);

  // Clear visited flags
  for (let i = 0; i < rows; i++) {
    for (let j = 0; j < cols; j++) {
      visited[i][j] = false;
    }
  }
  renderMaze(maze);
}


function updateMazeSize() {
  const slider = document.getElementById('maze-size-slider');
  const mazeSizeValue = document.getElementById('maze-size-value');
  const newSize = parseInt(slider.value);


  mazeSizeValue.textContent = newSize;

  maze = generateMaze(newSize, newSize);
  renderMaze(maze)
}





document.addEventListener("keydown", handleKeyDown);

function handleKeyDown(event) {
  // Handle player movement using arrow keys
  const oldCell = maze[playerRow][playerCol];
  let canUpdate = false;

  switch (event.key) {
    case "ArrowUp":
      if (!generalMaze[playerRow][playerCol].top) {
        playerRow--;
        canUpdate = true;
      }
      break;
    case "ArrowDown":
      if (!generalMaze[playerRow][playerCol].bottom) {
        playerRow++;
        canUpdate = true;
      }
      break;
    case "ArrowLeft":
      if (!generalMaze[playerRow][playerCol].left) {
        playerCol--;
        canUpdate = true;
      }
      break;
    case "ArrowRight":
      if (!generalMaze[playerRow][playerCol].right) {
        playerCol++;
        canUpdate = true;
      }
      break;
    default:
      return; // Exit this handler for other keys
  }

  const newCell = maze[playerRow][playerCol];
  if (canUpdate) {
    if (newCell.player_visited)
      markCell(oldCell);
    else
      markCell(newCell);
  }

  if (playerRow === generalMaze.length - 1 && playerCol === generalMaze[0].length - 1) {
    alert("You won!");
    
  }

  renderMaze(generalMaze);
}

function markCell(cell) {
  if (cell.player_visited)
    cell.player_visited = false;
  else
    cell.player_visited = true;
}

// Listen for keydown events

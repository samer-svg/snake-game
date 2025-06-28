// Wait for DOM to load
document.addEventListener('DOMContentLoaded', function() {
  console.log('DOM loaded, initializing game...');
  
  // Game elements
  const playBoard = document.querySelector('.game-board');
  const scoreElement = document.querySelector('.score');
  const highScoreElement = document.querySelector('.high-score');
  const gameOverlay = document.getElementById('gameOverlay');
  const finalScoreElement = document.getElementById('finalScore');
  const bestScoreElement = document.getElementById('bestScore');
  const restartBtn = document.getElementById('restartBtn');

  // Debug: Check if elements are found
  console.log('Elements found:', {
    playBoard: !!playBoard,
    scoreElement: !!scoreElement,
    highScoreElement: !!highScoreElement,
    gameOverlay: !!gameOverlay,
    finalScoreElement: !!finalScoreElement,
    bestScoreElement: !!bestScoreElement,
    restartBtn: !!restartBtn
  });

  // Game state
  let foodX, foodY;
  let snakeX = 5, snakeY = 10;
  let snakeBody = [];
  let directX = 0, directY = 0;
  let setIntervalId;
  let gameOver = false;
  let score = 0;
  let highScore = localStorage.getItem('high-score') || 0;

  // Touch controls for mobile
  let touchStartX = 0;
  let touchStartY = 0;

  // Initialize high score display
  highScoreElement.innerHTML = highScore;
  bestScoreElement.innerHTML = highScore;

  /**
   * Generates random food position
   */
  const changePosition = () => {
    foodX = Math.floor(Math.random() * 30) + 1;
    foodY = Math.floor(Math.random() * 30) + 1;
  }

  /**
   * Increases game speed based on score
   */
  const increaseSpeed = () => {
    clearInterval(setIntervalId);
    const baseSpeed = 120;
    const speedReduction = Math.floor(score / 5) * 10;
    const newSpeed = Math.max(baseSpeed - speedReduction, 60);
    setIntervalId = setInterval(initGame, newSpeed);
  }

  /**
   * Shows game over overlay
   */
  const showGameOver = () => {
    console.log('showGameOver called');
    console.log('Current score:', score);
    console.log('High score:', highScore);
    
    // Simple alert to test if function is called
    alert('Game Over! Score: ' + score);
    
    if (finalScoreElement) finalScoreElement.textContent = score;
    if (bestScoreElement) bestScoreElement.textContent = highScore;
    
    if (gameOverlay) {
      console.log('Adding show class to gameOverlay');
      gameOverlay.classList.add('show');
      console.log('GameOverlay classes:', gameOverlay.className);
    } else {
      console.log('gameOverlay element not found!');
    }
  }

  /**
   * Handles game over state
   */
  const handleGameOver = () => {
    console.log('handleGameOver called');
    if (gameOver) {
      console.log('Game already over, ignoring');
      return;
    }
    
    gameOver = true;
    console.log('Game over set to true');
    
    if (setIntervalId) {
      console.log('Clearing interval');
      clearInterval(setIntervalId);
      setIntervalId = null;
    }
    
    showGameOver();
  }

  /**
   * Restarts the game
   */
  const restartGame = () => {
    console.log('restartGame called');
    gameOver = false;
    score = 0;
    snakeX = 5;
    snakeY = 10;
    snakeBody = [];
    directX = 0;
    directY = 0;
    
    if (scoreElement) scoreElement.innerHTML = score;
    if (gameOverlay) gameOverlay.classList.remove('show');
    
    changePosition();
    initGame();
    setIntervalId = setInterval(initGame, 120);
  }

  /**
   * Handles keyboard input for direction changes
   */
  const changeDirection = (e) => {
    if (gameOver) return;
    
    const key = e.key;
    
    if (key === 'ArrowUp' && directY !== 1) {
      directX = 0;
      directY = -1;
    } else if (key === 'ArrowDown' && directY !== -1) {
      directX = 0;
      directY = 1;
    } else if (key === 'ArrowLeft' && directX !== 1) {
      directX = -1;
      directY = 0;
    } else if (key === 'ArrowRight' && directX !== -1) {
      directX = 1;
      directY = 0;
    }
    
    initGame();
  }

  /**
   * Handles touch input for mobile devices
   */
  const handleTouchStart = (e) => {
    touchStartX = e.touches[0].clientX;
    touchStartY = e.touches[0].clientY;
  }

  const handleTouchEnd = (e) => {
    if (gameOver) return;
    
    const touchEndX = e.changedTouches[0].clientX;
    const touchEndY = e.changedTouches[0].clientY;
    
    const deltaX = touchEndX - touchStartX;
    const deltaY = touchEndY - touchStartY;
    
    // Minimum swipe distance
    const minSwipeDistance = 30;
    
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      // Horizontal swipe
      if (Math.abs(deltaX) > minSwipeDistance) {
        if (deltaX > 0 && directX !== -1) {
          // Swipe right
          directX = 1;
          directY = 0;
        } else if (deltaX < 0 && directX !== 1) {
          // Swipe left
          directX = -1;
          directY = 0;
        }
      }
    } else {
      // Vertical swipe
      if (Math.abs(deltaY) > minSwipeDistance) {
        if (deltaY > 0 && directY !== -1) {
          // Swipe down
          directX = 0;
          directY = 1;
        } else if (deltaY < 0 && directY !== 1) {
          // Swipe up
          directX = 0;
          directY = -1;
        }
      }
    }
    
    initGame();
  }

  /**
   * Main game loop
   */
  const initGame = () => {
    if (gameOver) {
      console.log('Game is over, not updating');
      return;
    }
    
    let foodElement = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
    
    // Check if snake ate food
    if (snakeX === foodX && snakeY === foodY) {
      changePosition();
      snakeBody.push([foodX, foodY]);
      score++;
      
      // Update high score
      if (score > highScore) {
        highScore = score;
        localStorage.setItem('high-score', highScore);
        if (highScoreElement) highScoreElement.innerHTML = highScore;
      }
      
      if (scoreElement) scoreElement.innerHTML = score;
      increaseSpeed();
    }
    
    // Update snake body positions
    for (let i = snakeBody.length - 1; i > 0; i--) {
      snakeBody[i] = snakeBody[i - 1];
    }
    snakeBody[0] = [snakeX, snakeY];
    
    // Update snake head position
    snakeX += directX;
    snakeY += directY;
    
    // Check wall collision
    if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
      console.log('Wall collision detected');
      handleGameOver();
      return;
    }
    
    // Render snake
    for (let i = 0; i < snakeBody.length; i++) {
      const isHead = i === 0;
      const className = isHead ? 'snake-head' : 'snake-body';
      foodElement += `<div class="${className}" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
      
      // Check self collision
      if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
        console.log('Self collision detected');
        handleGameOver();
        return;
      }
    }
    
    if (playBoard) playBoard.innerHTML = foodElement;
  }

  // Event listeners
  document.addEventListener('keydown', changeDirection);
  if (restartBtn) restartBtn.addEventListener('click', restartGame);

  // Touch controls for mobile
  if (playBoard) {
    playBoard.addEventListener('touchstart', handleTouchStart, { passive: true });
    playBoard.addEventListener('touchend', handleTouchEnd, { passive: true });
  }

  // Prevent context menu on long press
  if (playBoard) {
    playBoard.addEventListener('contextmenu', (e) => e.preventDefault());
  }

  // Initialize game
  console.log('Initializing game...');
  changePosition();
  initGame();
  setIntervalId = setInterval(initGame, 120);
  console.log('Game initialized');
});

const playBoard = document.querySelector('.game-board');
const scoreElement = document.querySelector('.score');
const highScoreElement = document.querySelector('.high-score');

let foodX , foodY;
let snakeX=5,snakeY=10;
let snakeBody=[];
let directX=0,directY=0;
let setIntervalId;
let gameOver = false;
let score=0;
let highScore = localStorage.getItem('high-score') || 0;

highScoreElement.innerHTML=`High Score : ${highScore}`;

const changePosition = () => {
  foodX=Math.floor(Math.random() * 30)+1;
  foodY=Math.floor(Math.random() * 30)+1;
}

const faster = () => {
  clearInterval(setIntervalId);
  setIntervalId = setInterval(initGame,100);
}

const x3Faster = () => {
  clearInterval(setIntervalId);
  setIntervalId = setInterval(initGame,60);
}

const handleGameOver= () => {
  alert('game over! press OK to replay..');
  clearInterval(setIntervalId);
  location.reload();
}

const changeDirection = (e) => {
  if (e.key === 'ArrowUp' && directY !== 1) {
    directX=0;
    directY=-1;
  }
  else if (e.key === 'ArrowDown' && directY !== -1) {
    directX=0;
    directY=1;
  }
  else if (e.key === 'ArrowLeft' && directX !== 1) {
    directX=-1;
    directY=0;
  }
  else if (e.key === 'ArrowRight' && directX !== -1) {
    directX=1;
    directY=0;
  }
  initGame();
}

const initGame= () => {
  if (gameOver) {
    handleGameOver();
  }
  let foodElement = `<div class="food" style="grid-area: ${foodY} / ${foodX}"></div>`;
  // Check if snake ate food
  if (snakeX===foodX && snakeY===foodY) {
    changePosition();
    snakeBody.push([foodX,foodY]); // Add current head position as new segment
    score++;
    highScore= score >= highScore ? score:highScore;
    localStorage.setItem('high-score',highScore);
    if (score === 10) {
      faster();
    }
    if (score === 15) {
      x3Faster();
    }
    highScoreElement.innerHTML=`High Score : ${highScore}`;
    scoreElement.innerHTML=`score : ${score}`;
  }
  // Update body positions (shift all segments forward)
  for (let i = snakeBody.length-1; i > 0; i--) {
    snakeBody[i]=snakeBody[i-1];
  }
  snakeBody[0]=[snakeX, snakeY];
  snakeX+=directX;
  snakeY+=directY;

  if (snakeX <= 0 || snakeX >30 || snakeY<=0 || snakeY>30) {
    gameOver=true;
  }
  for (let i = 0; i < snakeBody.length; i++) {
    foodElement += `<div class="snake-head" style="grid-area: ${snakeBody[i][1]} / ${snakeBody[i][0]}"></div>`;
    if (i !== 0 && snakeBody[0][1] === snakeBody[i][1] && snakeBody[0][0] === snakeBody[i][0]) {
      gameOver=true;
    }
  }
  playBoard.innerHTML=foodElement;
}

changePosition();
initGame();
setIntervalId = setInterval(initGame,120);
document.addEventListener('keydown',changeDirection);
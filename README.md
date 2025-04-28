# 🐍 Classic Snake Game

A browser-based implementation of the classic Snake game with score tracking and progressive difficulty. Built with pure JavaScript, HTML, and CSS.

## ✨ Features

- **Traditional Snake Mechanics**: Navigate using arrow keys (↑ ↓ ← →)
- **Progressive Difficulty**: Speed increases at scores 10 and 15
- **Score System**: Tracks current and high scores (persists via localStorage)
- **Collision Detection**: Walls and self-collisions end the game
- **Responsive Design**: Works on desktop browsers

## 🎮 How to Play

1. Use **arrow keys** to change direction
2. Eat the food (red dot) to grow longer
3. Avoid hitting walls or your own tail
4. Game speeds up at 10 and 15 points
5. Game over triggers automatic restart prompt

## ⚙️ Game Logic Highlights

```javascript
// Core movement system
snakeX += directX;
snakeY += directY;

// Progressive difficulty
if (score === 10) faster(); // Speed increase 1
if (score === 15) x3Faster(); // Speed increase 2

// Collision detection
if (snakeX <= 0 || snakeX > 30 || snakeY <= 0 || snakeY > 30) {
  gameOver = true;
}
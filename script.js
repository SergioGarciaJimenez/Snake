document.addEventListener("DOMContentLoaded", (event) => {
  const gameContainer = document.querySelector(".game-container");
  const gridWidth = 50;
  const gridHeight = 30;
  const dimensions = gridWidth * gridHeight;
  const gridItemSize = 20;


  let time = 100;
  let currentDirection = "right"; 
  let nextDirection = "right"; 
  let score = 0;
  let points = document.getElementById("points");
  points.innerHTML = "Puntuación: " + score;

  let eat = new Audio("/sound/eat.wav");
  let die = new Audio("/sound/die.wav");

  for (let i = 0; i < dimensions; i++) {
    const gridItem = document.createElement("div");
    gridItem.classList.add("grid-item");
    gameContainer.appendChild(gridItem);
  }

  let snakePosition = Math.floor(dimensions / 2);
  let snake = [snakePosition];
  let foodPosition;

  function drawSnake() {
    snake.forEach((pos) => {
      const snakeElement = gameContainer.children[pos];
      snakeElement.style.width = gridItemSize + "px"; 
      snakeElement.style.height = gridItemSize + "px"; 
      snakeElement.classList.add("snake");
    });
  }

  function clearSnake() {
    snake.forEach((pos) => {
      const snakeElement = gameContainer.children[pos];
      snakeElement.style.width = ""; 
      snakeElement.style.height = ""; 
      snakeElement.classList.remove("snake");
    });
  }

  function placeFood() {
    do {
      foodPosition = Math.floor(Math.random() * dimensions);
    } while (snake.includes(foodPosition));
    const foodElement = gameContainer.children[foodPosition];
    foodElement.classList.add("food");
  }

  function clearFood() {
    const foodElement = gameContainer.children[foodPosition];
    foodElement.classList.remove("food");
  }

  // Increases the speed when the snake grows
  function checkSize() {
    if (score > 30){
      time = 30;
    }
    else if (score > 20){
      time = 50;
    }
    else if (score > 10) {
      time = 60;
    }
    else if (score > 5) {
      time = 75;
    }
    clearInterval(movement);
    movement = setInterval(snakeMovement, time);
  }

  function snakeMovement() {
    clearSnake();
    currentDirection = nextDirection;

    let newHeadPosition;
    switch (currentDirection) {
      case "down":
        newHeadPosition = snake[0] + gridWidth;
        break;
      case "up":
        newHeadPosition = snake[0] - gridWidth;
        break;
      case "left":
        newHeadPosition = snake[0] - 1;
        break;
      case "right":
        newHeadPosition = snake[0] + 1;
        break;
    }

    if (
      newHeadPosition < 0 ||
      newHeadPosition >= dimensions ||
      (currentDirection === "left" && newHeadPosition % gridWidth === gridWidth - 1) ||
      (currentDirection === "right" && newHeadPosition % gridWidth === 0)
    ) {
      die.play();
      clearInterval(movement);
      return;
    }

    if (snake.includes(newHeadPosition)) {
      die.play();
      clearInterval(movement);
      return;
    }

    snake.unshift(newHeadPosition);
    snakePosition = newHeadPosition;

    if (snakePosition === foodPosition) {
      eat.play();
      score += 1;
      checkSize();
      points.innerHTML = "Puntuación: " + score;
      clearFood();
      placeFood();
    } else {
      snake.pop();
    }

    drawSnake();
  }

  window.addEventListener(
    "keydown",
    function (event) {
      switch (event.key) {
        case "ArrowDown":
          if (currentDirection !== "up") {
            nextDirection = "down";
          }
          break;
        case "ArrowUp":
          if (currentDirection !== "down") {
            nextDirection = "up";
          }
          break;
        case "ArrowLeft":
          if (currentDirection !== "right") {
            nextDirection = "left";
          }
          break;
        case "ArrowRight":
          if (currentDirection !== "left") {
            nextDirection = "right";
          }
          break;
      }
    },
    true
  );

  drawSnake();
  placeFood();
  let movement = setInterval(snakeMovement, time);
});

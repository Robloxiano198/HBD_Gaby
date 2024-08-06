let player;
let gameContainer;
let balloonContainer;
let playerSpeed = 10;
let sushiFallSpeed = 3;
let foodCreationInterval = 1000; // Intervalo inicial en milisegundos para crear comida
let gameInterval;
let foodCount = 0;
let strikeCount = 0;
const maxStrikes = 3;
let highScore = 0;
const speedIncrementInterval = 5000; // Intervalo en milisegundos para incrementar la velocidad
const speedIncreaseAmount = 0.5; // Cantidad con la que incrementará la velocidad
const foodCreationIntervalDecrease = 100; // Cantidad en milisegundos con la que se reducirá el intervalo de creación de comida

document.addEventListener("DOMContentLoaded", function() {
    player = document.getElementById("player");
    gameContainer = document.getElementById("game-container");
    balloonContainer = document.getElementById("balloon-container");

    document.addEventListener("keydown", movePlayer);
    gameContainer.addEventListener("touchstart", movePlayerTouch);
    gameContainer.addEventListener("touchmove", movePlayerTouch);

    // Crear globos al cargar la página
    createBalloons();
});

function startGame() {
    document.querySelector("button").classList.add("hidden");
    balloonContainer.classList.add("hidden");
    gameContainer.classList.remove("hidden");
    gameInterval = setInterval(createFood, foodCreationInterval);

    // Incrementar la velocidad de caída cada cierto tiempo
    setInterval(increaseFallSpeed, speedIncrementInterval);
    // Aumentar la frecuencia de creación de comida cada cierto tiempo
    setInterval(decreaseFoodCreationInterval, 10000);
}

function movePlayer(e) {
    const playerRect = player.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    if (e.key === "ArrowLeft" && playerRect.left > containerRect.left) {
        player.style.left = player.offsetLeft - playerSpeed + "px";
    } else if (e.key === "ArrowRight" && playerRect.right < containerRect.right) {
        player.style.left = player.offsetLeft + playerSpeed + "px";
    }
}

function movePlayerTouch(e) {
    const touch = e.touches[0];
    const playerRect = player.getBoundingClientRect();
    const containerRect = gameContainer.getBoundingClientRect();

    if (touch.clientX > containerRect.left && touch.clientX < containerRect.right) {
        player.style.left = touch.clientX - containerRect.left - playerRect.width / 2 + "px";
    }
}

function createFood() {
    const foodTypes = ["sushi", "taco", "pizza"];
    const foodType = foodTypes[Math.floor(Math.random() * foodTypes.length)];
    const food = document.createElement("div");
    food.className = foodType;
    food.style.left = Math.random() * (gameContainer.clientWidth - 30) + "px";
    food.style.top = "0px";
    gameContainer.appendChild(food);

    let fallInterval = setInterval(function() {
        if (detectCollision(food, player)) {
            clearInterval(fallInterval);
            food.remove();
            foodCount++;
            document.getElementById("food-count").innerText = `Comida Recogida: ${foodCount}`;
        } else if (food.offsetTop > gameContainer.clientHeight) {
            clearInterval(fallInterval);
            food.remove();
            strikeCount++;
            document.getElementById("strike-count").innerText = `Strikes: ${strikeCount} / ${maxStrikes}`;
            if (strikeCount >= maxStrikes) {
                endGame();
            }
        } else {
            food.style.top = food.offsetTop + sushiFallSpeed + "px";
        }
    }, 20);
}

function detectCollision(food, player) {
    const foodRect = food.getBoundingClientRect();
    const playerRect = player.getBoundingClientRect();

    return !(
        foodRect.bottom < playerRect.top ||
        foodRect.top > playerRect.bottom ||
        foodRect.right < playerRect.left ||
        foodRect.left > playerRect.right
    );
}

function increaseFallSpeed() {
    sushiFallSpeed += speedIncreaseAmount;
}

function decreaseFoodCreationInterval() {
    if (foodCreationInterval > 200) { // Evitar que el intervalo de creación sea demasiado corto
        foodCreationInterval -= foodCreationIntervalDecrease;
        clearInterval(gameInterval);
        gameInterval = setInterval(createFood, foodCreationInterval);
    }
}

function endGame() {
    clearInterval(gameInterval);
    highScore = Math.max(highScore, foodCount);
    alert(`¡Perdiste! Tu récord es de ${highScore} ¡rompiste tu dieta 😂😇! 🍔🍣🌮`);
    location.reload();
}

function createBalloons() {
    const colors = ["#ff69b4", "#ffcc00", "#33cc99", "#66ccff", "#ff4b5c"];
    for (let i = 0; i < 20; i++) {
        const balloon = document.createElement("div");
        balloon.className = "balloon";
        balloon.style.backgroundColor = colors[i % colors.length];
        balloon.style.left = `${Math.random() * 100}%`;
        balloon.style.animationDuration = `${Math.random() * 3 + 3}s`;
        balloon.style.animationDelay = `${Math.random() * 2}s`;
        balloonContainer.appendChild(balloon);
    }
}

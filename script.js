const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// Player properties
let player = {
    x: canvas.width / 2 - 25, // Start in the middle
    y: canvas.height - 30,    // Near the bottom
    width: 50,
    height: 20,
    color: 'blue', // Represents the 'hand'
    speed: 15 // Speed of player movement
};

// Falling Item properties
const itemTypes = [
    { name: 'cookie', color: '#D2691E', width: 20, height: 20, scoreValue: 10, speedMultiplier: 1.0 }, // Brown for cookie
    { name: 'golden_cookie', color: 'gold', width: 25, height: 25, scoreValue: 50, speedMultiplier: 1.5 },
    { name: 'rubber_duck', color: 'yellow', width: 22, height: 22, scoreValue: 15, speedMultiplier: 1.1 },
    { name: 'pizza_slice', color: '#FFD700', width: 28, height: 28, scoreValue: 20, speedMultiplier: 1.2 }, // Yellowish for pizza
    { name: 'red_ball', color: 'red', width: 18, height: 18, scoreValue: 5, speedMultiplier: 0.9 },
];
let fallingItems = []; // Renamed from 'cookies' to 'fallingItems'
const itemSpawnInterval = 900; // Spawn a new item a bit faster
let lastItemSpawnTime = 0;
const baseItemSpeed = 2.2; // Slightly increased base speed

// Game state
let score = 0;
let lives = 3;
let gameOver = false;

// Keyboard event listeners
let rightPressed = false;
let leftPressed = false;

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = true;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.key == 'Right' || e.key == 'ArrowRight') {
        rightPressed = false;
    } else if (e.key == 'Left' || e.key == 'ArrowLeft') {
        leftPressed = false;
    }
}

function drawPlayer() {
    ctx.beginPath();
    ctx.rect(player.x, player.y, player.width, player.height);
    ctx.fillStyle = player.color;
    ctx.fill();
    ctx.closePath();
}

function updatePlayerPosition() {
    if (rightPressed && player.x < canvas.width - player.width) {
        player.x += player.speed;
    } else if (leftPressed && player.x > 0) {
        player.x -= player.speed;
    }
}

function spawnItem() {
    // Select a random item type from the itemTypes array
    const typeIndex = Math.floor(Math.random() * itemTypes.length);
    const type = itemTypes[typeIndex];

    let item = {
        x: Math.random() * (canvas.width - type.width), // Random x position
        y: 0 - type.height, // Start just above the screen
        width: type.width,
        height: type.height,
        color: type.color,
        speed: baseItemSpeed * type.speedMultiplier,
        scoreValue: type.scoreValue,
        name: type.name
    };
    fallingItems.push(item);
}

function drawItems() {
    fallingItems.forEach(item => {
        ctx.beginPath();
        // Simple rectangle for now. Could be replaced with images or more complex shapes.
        ctx.rect(item.x, item.y, item.width, item.height);
        ctx.fillStyle = item.color;
        ctx.fill();
        ctx.closePath();

        // Optional: Draw item name for debugging or if they are not visually distinct enough
        // ctx.fillStyle = 'black';
        // ctx.font = '10px Arial';
        // ctx.fillText(item.name, item.x, item.y + item.height / 2);
    });
}

function checkCollision(rect1, rect2) {
    return rect1.x < rect2.x + rect2.width &&
           rect1.x + rect1.width > rect2.x &&
           rect1.y < rect2.y + rect2.height &&
           rect1.y + rect1.height > rect2.y;
}

function updateItemsAndCollisions() {
    for (let i = fallingItems.length - 1; i >= 0; i--) {
        let item = fallingItems[i];
        item.y += item.speed;

        if (checkCollision(player, item)) {
            score += item.scoreValue;
            fallingItems.splice(i, 1);
            // console.log("Caught a " + item.name + "! Score: " + score);
            continue;
        }

        if (item.y > canvas.height) {
            lives--;
            fallingItems.splice(i, 1);
            // console.log("Missed a " + item.name + "! Lives: " + lives);
            if (lives <= 0) {
                gameOver = true;
                // console.log("Game Over!");
            }
        }
    }
}

function drawScore() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Score: ' + score, 8, 20);
}

function drawLives() {
    ctx.font = '16px Arial';
    ctx.fillStyle = '#000';
    ctx.fillText('Lives: ' + lives, canvas.width - 65, 20);
}

function drawGameOver() {
    ctx.font = '40px Arial';
    ctx.fillStyle = 'red';
    ctx.textAlign = 'center';
    ctx.fillText('GAME OVER', canvas.width / 2, canvas.height / 2);
    ctx.font = '20px Arial';
    ctx.fillText('Press F5 to Restart', canvas.width / 2, canvas.height / 2 + 30);
    ctx.textAlign = 'start';
}


function gameLoop(currentTime) {
    if (gameOver) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        drawPlayer();
        drawItems();
        drawScore();
        drawLives();
        drawGameOver();
        return;
    }

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (currentTime - lastItemSpawnTime > itemSpawnInterval) {
        spawnItem();
        lastItemSpawnTime = currentTime;
    }

    drawPlayer();
    updatePlayerPosition();

    updateItemsAndCollisions();
    drawItems();

    drawScore();
    drawLives();

    requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);

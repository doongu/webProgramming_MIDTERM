var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;

var shipSize = 40;
var shipImg = new Image();
shipImg.src = "./media/ship.png";
var ship = {
    x: (canvas.width - shipSize) / 2,
    y: canvas.height - shipSize,
    w: shipSize,
    h: shipSize
};
var enemySize = 40;
var enemyImg = new Image();
enemyImg.src = "./media/enemy.png";
var enemyCount = 10;
var enemyStatus = [];
for (var i = 0; i < enemyCount; i++) {
    enemyStatus[i] = {
        x: 0,
        y: 0,
        w: enemySize,
        h: enemySize,
        img: enemyImg,
        status: 0
    };
}
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);

function keyDownHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = true;
    } else if (e.code == 'ArrowLeft') {
        leftPressed = true;
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false;
    } else if (e.code == 'ArrowLeft') {
        leftPressed = false;
    }
}

function checkCrash() {
    for (var i = 0; i < enemyCount; i++) {
        var enemy = enemyStatus[i];
        if (enemy.status == 0) {
            continue;
        }

        ship.rx = ship.x + ship.w;
        ship.by = ship.y + ship.h;
        enemy.rx = enemy.x + enemy.w;
        enemy.by = enemy.y + enemy.h;

        if ((ship.x >= enemy.x && ship.x <= enemy.rx) ||
            (ship.rx >= enemy.x && ship.rx <= enemy.rx)) {
            if ((ship.y >= enemy.y && ship.y <= enemy.by) ||
                (ship.by >= enemy.y && ship.by <= enemy.by)) {
                return 1;
            }
        }
    }
    return 0;
}

function createNewEnemy(probWeight, gameLevel) {
    if (Math.floor(Math.random() * probWeight) < gameLevel) {
        for (var i = 0; i < enemyCount; i++) {
            var enemy = enemyStatus[i];

            if (enemy.status == 0) {
                enemy.y = 0;
                enemy.x = Math.floor(Math.random() * canvas.width);

                if (enemy.x + enemySize > canvas.width) {
                    enemy.x = canvas.width - enemySize;
                }
                enemy.status = 1;
                break;
            }
        }
    }
}

function drawAllEnemies() {
    for (var i = 0; i < enemyCount; i++) {
        var enemy = enemyStatus[i];

        if (enemy.status == 0) {
            continue;
        }

        enemy.y += 2;

        if (enemy.y + enemySize <= canvas.height) {
            ctx.drawImage(enemy.img, enemy.x, enemy.y, enemy.w, enemy.h);
        } else {
            enemy.status = 0;
        }
    }
    createNewEnemy(30, 1);
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawAllEnemies();
    ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);

    if (rightPressed && ship.x < canvas.width - shipSize) {
        ship.x += 10;
    } else if (leftPressed && ship.x > 0) {
        ship.x -= 10;
    }
    if (checkCrash()) {
        ctx.fillText("Crash!!", 10, 20);
    }
    requestAnimationFrame(draw);
}
draw();
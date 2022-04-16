var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;


var shipImg = new Image();
var enemyImg = new Image();
var heartImg = new Image();
var goldshipImg = new Image();
var bulletImg = new Image();


shipImg.src = "./media/ship.png";
enemyImg.src = "./media/enemy.png";
heartImg.src = "./media/heart.png";
goldshipImg.src = "./media/goldship.png";
bulletImg.src = "./media/bullet.png";


var shipSize = 40,
    shipStatus = false,
    ship = {};
var enemySize = 40,
    enemyCount = 10,
    enemyStatus = [];
var heartSize = 100,
    heartCount = 3,
    heartStatus = [];
var bulletSize = 30,
    bulletSpeed = 3,
    bullet = {};


document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = true;
    }
    if (e.code == 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.code == 'Space') {
        shipStatus = true;
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false;
    }
    if (e.code == 'ArrowLeft') {
        leftPressed = false;
    }
    if (e.key == 'Space') {
        shipStatus = false;
    }
}
function showText() {
    if (shipStatus) {

    }
}
var init_start = true;
var init_text_value = true;

function init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue) {
    if (initValue) {
        if (shipStatus == false) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Lato';
            ctx.fillText("Press 'Space' Start",
                canvas.width / 2 - ctx.measureText("Press 'Space' Start").width / 2,
                canvas.height / 2 - 20);
            return true;
        }
        else {
            ship = {
                x: (canvas.width - shipSize) / 2,
                y: canvas.height - shipSize,
                w: shipSize,
                h: shipSize,
                superPower: false
            };
            for (var i = 0; i < 100; i++) {
                bullet[i] = {
                    x: ship.x,
                    y: ship.y,
                    w: bulletSize,
                    h: bulletSize,
                    img: bulletImg,
                    speed: bulletSpeed,
                    status: false
                }

            }
            for (var i = 0; i < heartCount; i++) {
                heartStatus[i] = {
                    x: i * 30,
                    y: 0,
                    w: heartSize,
                    h: heartSize,
                    img: heartImg,
                    status: 0
                }
            }
            for (var i = 0; i < enemyCount; i++) {
                enemyStatus[i] = {
                    x: 0,
                    y: 0,
                    w: enemySize,
                    h: enemySize,
                    img: enemyImg,
                    status: 0
                }
            }
            return false;
        }
    }

    if (shipStatus) {
        for (var i = 0; i < 100; i++) {
            bullet[i] = {
                x: ship.x,
                y: ship.y,
                w: bulletSize,
                h: bulletSize,
                img: bulletImg,
                speed: bulletSpeed,
                status: false
            }

        }
        ship = {
            x: (canvas.width - shipSize) / 2,
            y: canvas.height - shipSize,
            w: shipSize,
            h: shipSize,
            superPower: false
        };
        for (var i = 0; i < heartCount; i++) {
            heartStatus[i] = {
                x: i * 30,
                y: 0,
                w: heartSize,
                h: heartSize,
                img: heartImg,
                status: 0
            }
        }
        for (var i = 0; i < enemyCount; i++) {
            enemyStatus[i] = {
                x: 0,
                y: 0,
                w: enemySize,
                h: enemySize,
                img: enemyImg,
                status: 0
            }
        }
        return false;
    }
    else {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Lato';
        ctx.fillText("Press 'Space' ReStart",
            canvas.width / 2 - ctx.measureText("Press 'Space' ReStart").width / 2,
            canvas.height / 2 - 20);
    }
}



function drowShip() {
    if (ship.superPower) {
        ctx.drawImage(goldshipImg, ship.x, ship.y, ship.w, ship.h);
        // continue;
    } else {
        ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
    }
    if (rightPressed && ship.x < canvas.width - shipSize) {
        ship.x += 10;
    } else if (leftPressed && ship.x > 0) {
        ship.x -= 10;
    }
}

function superPower() {
    ship.superPower = true;
    setTimeout(function () {
        ship.superPower = false;
    }, 2000);
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

function checkCrash() {
    for (var i = 0; i < enemyCount; i++) {
        var enemy = enemyStatus[i];
        if (enemy.status == 0) {
            continue;
        }
        if (ship.superPower) {
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
                enemy.status = 0;
                superPower();
                return 1;
            }
        }
    }
    return 0;
}


function checkheart() {
    var count = 0;
    for (var i = 0; i < heartCount; i++) {
        if (heartStatus[i].status == 1) {
            count += 1;
        }
    }
    if (count == heartCount) {
        return true;
    }
    return false;
}


function deleteHeart() {
    if (checkCrash()) {
        for (var i = 0; i < heartCount; i++) {
            if (heartStatus[i].status == 0) {
                heartStatus[i].status = 1;
                return;
            }
        }
    }
}

function drowHeart() {
    for (var i = 0; i < heartCount; i++) {
        if (heartStatus[i].status == 0) {
            ctx.drawImage(heartStatus[i].img, heartStatus[i].x, heartStatus[i].y, heartStatus[i].w, heartStatus[i].h);
        }
    }

}


function drowbullet() {
    if (shipStatus) {
        for (var i = 0; i < 100; i++) {
            // bulletCheck()
            if (bullet[i].status == false) {
                bullet[i].x = ship.x;
                bullet[i].y = ship.y;
                bullet[i].status = true
                break
            }
        }

    }
    for (var i = 0; i < 100; i++) {
        if (bullet[i].status == true) {
            bullet[i].y -= bullet[i].speed;
            ctx.drawImage(bullet[i].img, bullet[i].x, bullet[i].y, bullet[i].w, bullet[i].h);
            if (bullet[i].y < 0) {
                bullet[i] = {
                    x: ship.x,
                    y: ship.y,
                    w: bulletSize,
                    h: bulletSize,
                    img: bulletImg,
                    speed: bulletSpeed,
                    status: false
                }
            }
        }
    }
}
var initValue = true;

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (initValue) {
        initValue = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue);
        shipStatus = false;
    }
    else {
        if (checkheart()) {
            shipStatus = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue);

        } else {
            drawAllEnemies();
            drowHeart();
            drowShip();
            shipStatus = drowbullet();
            deleteHeart();

        }
    }

    requestAnimationFrame(draw);
}

draw();
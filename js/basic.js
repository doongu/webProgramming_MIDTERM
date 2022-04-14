var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;


var goldshipImg = new Image();
goldshipImg.src = "./media/goldship.png";
var spaceStatus = false;
var shipSize = 40;
var shipImg = new Image();
shipImg.src = "./media/ship.png";
var ship = {
    x: (canvas.width - shipSize) / 2,
    y: canvas.height - shipSize,
    w: shipSize,
    h: shipSize,
    superPower: false
};
var enemySize = 40;
var enemyImg = new Image();
enemyImg.src = "./media/enemy.png";
var enemyCount = 10;
var enemyStatus = [];


var heartSize = 100;
var heartImg = new Image();
heartImg.src = "./media/heart.png";
var heartCount = 3;
var heartStatus = [];

// for (var i = 0; i < heartCount; i++) {
//     heartStatus[i] = {
//         x: i * 30,
//         y: 0,
//         w: heartSize,
//         h: heartSize,
//         img: heartImg,
//         status: 0
//     }
// }


// for (var i = 0; i < enemyCount; i++) {
//     enemyStatus[i] = {
//         x: 0,
//         y: 0,
//         w: enemySize,
//         h: enemySize,
//         img: enemyImg,
//         status: 0
//     };
// }


function init(spaceStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount ){
    if (spaceStatus){
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

document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);




function keyDownHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = true;
    }
     if (e.code == 'ArrowLeft') {
        leftPressed = true;
    }
    if (e.code =='Space'){

        spaceStatus = true;
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false;
    } 
    if (e.code == 'ArrowLeft') {
        leftPressed = false;
    }
    // if (e.key =='Space'){
    //     spaceStatus = false;
    // }
}
function superPower() {
    ship.superPower = true;
    setTimeout(function () { ship.superPower = false; }, 2000);
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
    for (var i = 0; i < heartCount; i++) {
        if (heartStatus[i].status == 0) {
            heartStatus[i].status = 1;
            return;
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


function drowShip() {
    if (ship.superPower) {
        ctx.drawImage(goldshipImg, ship.x, ship.y, ship.w, ship.h);
        // continue;
    }
    else {
        ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
    }
    if (rightPressed && ship.x < canvas.width - shipSize) {
        ship.x += 10;
    } else if (leftPressed && ship.x > 0) {
        ship.x -= 10;
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if (checkheart()) {
        spaceStatus = init(spaceStatus,  heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount);
    }
    else{
        drawAllEnemies();
        drowHeart();
        drowShip();
        
    if (checkCrash()) {
        
        
        deleteHeart();
        ctx.fillText("Crash!!", 10, 20);
        
    }
}

    requestAnimationFrame(draw);
}

init(true, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount);
draw();
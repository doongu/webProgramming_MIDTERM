var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;
var scoreValue = 0;
var initValue = true;

// img 객체 초기화
var shipImg = new Image();
var enemyImg = new Image();
var heartImg = new Image();
var goldshipImg = new Image();
var bulletImg = new Image();


// 이미지들을 초기화 한다.
shipImg.src = "./media/ship.png"; // 우주선img
enemyImg.src = "./media/enemy.png"; // 적 img
heartImg.src = "./media/heart.png"; // 생명 img
goldshipImg.src = "./media/goldship.png"; // 무적 img
bulletImg.src = "./media/bullet.png"; // 총알 img

// 우주선, 적, 목숨, 총알 값 초기화
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

// keydown과 keyup에 대한 EventListener추가 , EventListener는 항상 감지하기 때문에
// 별도로 함수에 넣지 않아도 된다.
document.addEventListener('keydown', keyDownHandler, false);
document.addEventListener('keyup', keyUpHandler, false);


function keyDownHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = true; //right키가 눌리면 rightPressed를 true로 변경
    }
    if (e.code == 'ArrowLeft') {
        leftPressed = true; //left키가 눌리면 leftPressed를 true로 변경
    }
    if (e.code == 'Space') { //Space키가 눌리면 shipStatus를 true로 변경
        shipStatus = true;
    }
}

function keyUpHandler(e) {
    if (e.code == 'ArrowRight') {
        rightPressed = false; //right키가 떼지면 rightPressed를 false로 변경
    }
    if (e.code == 'ArrowLeft') {
        leftPressed = false; //left키가 떼지면 shipStatus를 false로 변경
    }
    if (e.key == 'Space') {
        shipStatus = false; //Space키가 떼지면 shipStatus를 true로 변경
    }
}


/*
초기화 함수
*/
function init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue) {

    // initValue값을 통해 젤처음 시작할 때 텍스트를 띄워준다.
    if (initValue) {

        // space를 누르지 않은 상태면 텍스트를 띄운다.
        if (shipStatus == false) {
            ctx.fillStyle = 'white';
            ctx.font = 'bold 30px Lato';
            ctx.fillText("Press 'Space' to Start",
                canvas.width / 2 - ctx.measureText("Press 'Space' to Start").width / 2,
                canvas.height / 2 - 20);
            return true;

            // space를 눌렀으면 ship, bullet, heart, enemy 값을 초기화해준다.
        } else {

            ship = {
                x: (canvas.width - shipSize) / 2,
                y: canvas.height - shipSize,
                w: shipSize,
                h: shipSize,
                superPower: false
            };
            for (var i = 0; i < 100; i++) {
                bullet[i] = {
                    x: ship.x + ship.w / 2,
                    y: ship.y,
                    w: bulletSize / 4,
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
            shipStatus = false;
        }
    }


    // 재시작인 경우이다. shipStatus가 true라는 건 space를 눌렀다는 것이므로
    // 위 값들을 초기화 해준다. 
    else if (shipStatus) {
        scoreValue = 0;

        for (var i = 0; i < 100; i++) {
            bullet[i] = {
                x: ship.x + ship.w / 2,
                y: ship.y,
                w: bulletSize / 4,
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

    // 재시작인 경우이며, space를 누르지 않은 상태이므로 Space를 눌러달라는 메세지를 출력한다.
    else {
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Lato';
        ctx.fillText("Press 'Space' to ReStart",
            canvas.width / 2 - ctx.measureText("Press 'Space' to ReStart").width / 2,
            canvas.height / 2 - 20);
    }
}


function initDraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // initValue가 False이면 draw함수를 통해 게임을 시작한다. 
    if (initValue) {
        initValue = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue);
    } else {
        cancelAnimationFrame(initDraw);
        draw();
        return;
    }
    requestAnimationFrame(initDraw);

}


/*
Ship 관련 함수
*/
function drowShip() {
    // 현재 무적상태이면 goldshipImg를 그린다.
    if (ship.superPower) {
        ctx.drawImage(goldshipImg, ship.x, ship.y, ship.w, ship.h);

    }

    // 무적상태가 아니라면, 일반 ship을 그린다
    else {
        ctx.drawImage(shipImg, ship.x, ship.y, ship.w, ship.h);
    }

    // 오른쪽 왼쪽 이동방향을 움직이도록 canvas 내에서 설정해준다. 
    if (rightPressed && ship.x < canvas.width - shipSize) {
        ship.x += 10;
    } else if (leftPressed && ship.x > 0) {
        ship.x -= 10;
    }
}

// 무적함수
function superPower() {
    ship.superPower = true;
    // setTimeout함수를 통해 2초뒤 무적상태를 해제해준다.
    setTimeout(function () {
        ship.superPower = false;
    }, 2000);
}


/*
Enemy 관련 함수
*/
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

// 적들을 그린다.
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


/*
동작 관련 함수
*/
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

        // 적과 충돌하게되면 enemy.status를 0으로 만들고 superPower()를 호출
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


/*
생명 관련 함수
*/
function drowHeart() {
    for (var i = 0; i < heartCount; i++) {
        // 생명 상태가 0인것만 그린다.
        if (heartStatus[i].status == 0) {
            ctx.drawImage(heartStatus[i].img, heartStatus[i].x, heartStatus[i].y, heartStatus[i].w, heartStatus[i].h);
        }
    }

}

// 매번 하트가 다 사용되었는지 확인
function checkHeart() {
    var count = 0;
    for (var i = 0; i < heartCount; i++) {
        if (heartStatus[i].status == 1) {
            count += 1;
        }
    }
    if (count == heartCount) {
        shipStatus = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, bulletSize, bulletSpeed, initValue);
    }
    return false;
}

// 부딪히면 heartStatus.status를 1로 바꾸어 표시하지 않는다.
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



/*
총알 관련 함수
*/
function drowbullet() {
    if (shipStatus) {
        //최대 100개의 총알을 발사할 수 있도록 했다.
        // a는 가속도이다.
        for (var i = 0; i < 100; i++) {
            if (bullet[i].status == false) {
                bullet[i].x = ship.x + ship.w / 2 - (bullet[i].w / 2);
                bullet[i].y = ship.y;
                bullet[i].status = true
                bullet[i].a = 1;
                break
            }
        }

    }
    for (var i = 0; i < 100; i++) {
        if (bullet[i].status == true) {
            bullet[i].a *= 1.06
            bullet[i].y -= bullet[i].a;
            ctx.drawImage(bullet[i].img, bullet[i].x, bullet[i].y, bullet[i].w, bullet[i].h);
            if (bullet[i].y < 0.1) {
                bullet[i] = {
                    x: ship.x + ship.w / 2,
                    y: ship.y,
                    w: bulletSize / 4,
                    h: bulletSize,
                    img: bulletImg,
                    speed: bulletSpeed,
                    status: false
                }
            }
        }
    }
    shipStatus = false;
}

// score 관련 함수
function score() {
    ctx.fillText('Score : ' + scoreValue, 10, 70);
}


// 공격함수
function attack() {
    for (var i = 0; i < enemyCount; i++) {
        if (enemyStatus[i].status == 0) {
            continue;
        }
        for (var j = 0; j < 100; j++) {
            if (bullet[j].status == true) {
                bullet[j].rx = bullet[j].x + bullet[j].w;
                bullet[j].by = bullet[j].y + bullet[j].h;
                enemyStatus[i].rx = enemyStatus[i].x + enemyStatus[i].w;
                enemyStatus[i].by = enemyStatus[i].y + enemyStatus[i].h;
                if ((bullet[j].x >= enemyStatus[i].x && bullet[j].x <= enemyStatus[i].rx) || (bullet[j].rx >= enemyStatus[i].x && bullet[j].rx <= enemyStatus[i].rx)) {
                    if ((bullet[j].y >= enemyStatus[i].y && bullet[j].y <= enemyStatus[i].by) ||
                        (bullet[j].by >= enemyStatus[i].y && bullet[j].by <= enemyStatus[i].by)) {
                        //총알과 적이 부딪히면 총알과 적을 삭제하고 score가 올라간다.
                        enemyStatus[i].status = 0;
                        bullet[j].status = false;
                        scoreValue += 1;
                    }
                }
            }
        }
    }
}


// main 함수
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    checkHeart();
    drawAllEnemies();
    drowHeart();
    drowShip();
    drowbullet();
    deleteHeart();
    attack();
    score();

    requestAnimationFrame(draw);
}

initDraw(); // initDraw 함수 실행
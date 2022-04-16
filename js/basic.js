var canvas = document.getElementById('gameCanvas');
var ctx = canvas.getContext('2d');
var rightPressed = false;
var leftPressed = false;


var shipImg = new Image();
var enemyImg = new Image();
var heartImg = new Image();
var goldshipImg = new Image();


shipImg.src = "./media/ship.png";
enemyImg.src = "./media/enemy.png";
heartImg.src = "./media/heart.png";
goldshipImg.src = "./media/goldship.png";


var shipSize = 40,
	shipStatus = false,
	ship = {};
var enemySize = 40,
	enemyCount = 10,
	enemyStatus = [];
var heartSize = 100,
	heartCount = 3,
	heartStatus = [];


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
function showText(){
    if (shipStatus){
        
    }
}
var init_start = true;
var init_text_value = true;

function init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, initValue) {
    if (initValue){
        if(shipStatus == false){
        ctx.fillStyle = 'white';
        ctx.font = 'bold 30px Lato';
        ctx.fillText("Press 'Space' Start",
        canvas.width / 2 - ctx.measureText("Press 'Space' Start").width / 2,
        canvas.height / 2 - 20);
        return true; 
        }
        else{
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
    }

    if (shipStatus) {
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
    else{
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
	setTimeout(function() {
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


var initValue = true;

function draw() {
	ctx.clearRect(0, 0, canvas.width, canvas.height);
    if (initValue){
        initValue = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount, initValue);
        shipStatus = false;
    }
  else{
    if (checkheart()) {
        // checkShowText();
        shipStatus = init(shipStatus, heartSize, heartImg, heartCount, enemySize, enemyImg, enemyCount,  initValue);
        
	} else {
		drawAllEnemies();
		drowHeart();
		drowShip();

		if (checkCrash()) {
			deleteHeart();
			ctx.fillText("Crash!!", 10, 20);

		}
	}
  }
	

	requestAnimationFrame(draw);
}

draw();
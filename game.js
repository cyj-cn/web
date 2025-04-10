const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');

// 游戏对象
const player = {
    x: canvas.width / 2,
    y: canvas.height - 50,
    width: 40,
    height: 40,
    speed: 7,
    bullets: [],
    isAlive: true
};

const enemies = [];
let score = 0;

// 玩家飞机图片
const playerImg = new Image();
playerImg.src = 'https://img.icons8.com/color/48/000000/airplane-front-view.png';

// 监听键盘事件
document.addEventListener('keydown', handleKeyPress);

// 主游戏循环
function gameLoop() {
    if (!player.isAlive) return; // 游戏结束

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // 绘制玩家
    ctx.drawImage(playerImg, player.x - player.width/2, player.y, player.width, player.height);

    // 移动子弹
    player.bullets.forEach((bullet, index) => {
        bullet.y -= 10;
        ctx.fillStyle = '#ff0000';
        ctx.fillRect(bullet.x, bullet.y, 4, 10);
        if (bullet.y < 0) player.bullets.splice(index, 1);
    });

    // 生成敌人
    if (Math.random() < 0.03) {
        enemies.push({
            x: Math.random() * (canvas.width - 30),
            y: 0,
            width: 30,
            height: 30,
            speed: 3
        });
    }

    // 移动并绘制敌人
    enemies.forEach((enemy, index) => {
        enemy.y += enemy.speed;
        ctx.fillStyle = '#00ff00';
        ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);

        // 碰撞检测
        if (detectCollision(player, enemy)) {
            player.isAlive = false;
            alert(`游戏结束！得分: ${score}`);
        }

        // 子弹击中敌人
        player.bullets.forEach((bullet, bulletIndex) => {
            if (detectCollision(bullet, enemy)) {
                enemies.splice(index, 1);
                player.bullets.splice(bulletIndex, 1);
                score += 10;
            }
        });
    });

    // 显示分数
    ctx.fillStyle = '#fff';
    ctx.font = '24px Arial';
    ctx.fillText(`分数: ${score}`, 10, 30);

    requestAnimationFrame(gameLoop);
}

// 碰撞检测函数
function detectCollision(rect1, rect2) {
    return (
        rect1.x < rect2.x + rect2.width &&
        rect1.x + rect1.width > rect2.x &&
        rect1.y < rect2.y + rect2.height &&
        rect1.y + rect1.height > rect2.y
    );
}

// 键盘控制
function handleKeyPress(e) {
    if (!player.isAlive) return;
    switch(e.key) {
        case 'ArrowLeft':
            if (player.x > 20) player.x -= player.speed;
            break;
        case 'ArrowRight':
            if (player.x < canvas.width - 20) player.x += player.speed;
            break;
        case ' ':
            player.bullets.push({ x: player.x, y: player.y - 10, width: 4, height: 10 });
            break;
    }
}

// 启动游戏
gameLoop();
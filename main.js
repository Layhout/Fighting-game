const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

canvas.width = 1024;
canvas.height = 576;

c.fillRect(0, 0, canvas.width, canvas.height);

const gravity = 0.7;

const background = new Sprite({
    position: {
        x: 0,
        y: 0,
    },
    imageSrc: "./img/background.png"
})

const shop = new Sprite({
    position: {
        x: 620,
        y: 125,
    },
    imageSrc: "./img/shop.png",
    scale: 2.75,
    framesMax: 6
})

const player = new Fighter({
    position: {
        x: 256,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "red",
    offset: {
        x: 215,
        y: 157,
    },
    imageSrc: "./img/samuraiMack/Idle.png",
    framesMax: 8,
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: "./img/samuraiMack/Idle.png",
            framesMax: 8
        },
        run: {
            imageSrc: "./img/samuraiMack/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/samuraiMack/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/samuraiMack/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/samuraiMack/Attack1.png",
            framesMax: 6
        },
        takeHit: {
            imageSrc: "./img/samuraiMack/Take Hit - white silhouette.png",
            framesMax: 4
        },
        death: {
            imageSrc: "./img/samuraiMack/Death.png",
            framesMax: 6
        },
    },
    attackBox: {
        offset: {
            x: 100,
            y: 50
        },
        width: 155,
        height: 50
    }
});

const enemy = new Fighter({
    position: {
        x: 720,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "blue",
    offset: {
        x: 215,
        y: 167,
    },
    imageSrc: "./img/kenji/Idle.png",
    framesMax: 4,
    scale: 2.5,
    sprites: {
        idle: {
            imageSrc: "./img/kenji/Idle.png",
            framesMax: 4
        },
        run: {
            imageSrc: "./img/kenji/Run.png",
            framesMax: 8
        },
        jump: {
            imageSrc: "./img/kenji/Jump.png",
            framesMax: 2
        },
        fall: {
            imageSrc: "./img/kenji/Fall.png",
            framesMax: 2
        },
        attack1: {
            imageSrc: "./img/kenji/Attack1.png",
            framesMax: 4
        },
        takeHit: {
            imageSrc: "./img/kenji/Take Hit.png",
            framesMax: 3
        },
        death: {
            imageSrc: "./img/kenji/Death.png",
            framesMax: 7
        },
    },
    attackBox: {
        offset: {
            x: -170,
            y: 50
        },
        width: 170,
        height: 50
    }
});

const key = {
    a: {
        pressed: false,
    },
    d: {
        pressed: false,
    },
    w: {
        pressed: false,
    },
    ArrowRight: {
        pressed: false,
    },
    ArrowLeft: {
        pressed: false,
    },
    ArrowUp: {
        pressed: false,
    },
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    shop.update();
    c.fillStyle = "rgba(255,255,255,0.15)"
    c.fillRect(0, 0, canvas.width, canvas.height);
    player.update();
    enemy.update();
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (key.a.pressed && player.lastKey === "a" && player.position.x > 0) {
        player.velocity.x = -5;
        player.switchSprite("run");
    } else if (key.d.pressed && player.lastKey === "d" && player.position.x < canvas.width - 65) {
        player.velocity.x = 5
        player.switchSprite("run");
    } else {
        player.switchSprite("idle");
    }

    // jumping
    if (player.velocity.y < 0) {
        player.switchSprite("jump");
    } else if (player.velocity.y > 0) {
        player.switchSprite("fall")
    }

    // enemy movement
    if (key.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft" && enemy.position.x > 0) {
        enemy.velocity.x = -5
        enemy.switchSprite("run");
    } else if (key.ArrowRight.pressed && enemy.lastKey === "ArrowRight" && enemy.position.x < canvas.width - 60) {
        enemy.velocity.x = 5
        enemy.switchSprite("run");
    } else {
        enemy.switchSprite("idle");
    }

    // jumping
    if (enemy.velocity.y < 0) {
        enemy.switchSprite("jump");
    } else if (enemy.velocity.y > 0) {
        enemy.switchSprite("fall")
    }

    // detect for cllision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
        enemy.takeHit();
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }

    // if player misses
    if (player.isAttacking && player.framesCurrent === 4) {
        player.isAttacking = false;
    }

    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false
        player.takeHit();
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

    // if enemy misses
    if (enemy.isAttacking && enemy.framesCurrent === 2) {
        enemy.isAttacking = false;
    }

    // end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timer });
    }
}

animate();

window.addEventListener("keydown", (e) => {
    if (!player.dead) {
        switch (e.key) {
            case "d":
                key.d.pressed = true;
                player.lastKey = "d";
                break;
            case "a":
                key.a.pressed = true;
                player.lastKey = "a";
                break;
            case "w":
                if (player.velocity.y === 0) player.velocity.y = -20;
                break;
            case " ":
                player.attack();
                break;
        }
    }
    if (!enemy.dead) {
        switch (e.key) {
            case "ArrowRight":
                key.ArrowRight.pressed = true;
                enemy.lastKey = "ArrowRight";
                break;
            case "ArrowLeft":
                key.ArrowLeft.pressed = true;
                enemy.lastKey = "ArrowLeft";
                break;
            case "ArrowUp":
                if (enemy.velocity.y === 0) enemy.velocity.y = -20;
                break;
            case "ArrowDown":
                enemy.attack();
                break;
        }
    }
})

window.addEventListener("keyup", (e) => {
    switch (e.key) {
        case "d":
            key.d.pressed = false;
            break;
        case "a":
            key.a.pressed = false;
            break;
        case "w":
            key.w.pressed = false;
            break;
        case "ArrowRight":
            key.ArrowRight.pressed = false;
            break;
        case "ArrowLeft":
            key.ArrowLeft.pressed = false;
            break;
        case "ArrowUp":
            key.ArrowUp.pressed = false;
            break;
    }
})
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

const player = new Fighter({
    position: {
        x: 0,
        y: 0,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "red",
    offset: {
        x: 0,
        y: 0,
    }
});

const enemy = new Fighter({
    position: {
        x: 400,
        y: 100,
    },
    velocity: {
        x: 0,
        y: 0,
    },
    color: "blue",
    offset: {
        x: -50,
        y: 0,
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

function rectangularCollision({ rectangle1, rectangle2 }) {
    return rectangle1.attackBox.position.x + rectangle1.attackBox.width >= rectangle2.position.x &&
        rectangle1.attackBox.position.x <= rectangle2.position.x + rectangle2.width &&
        rectangle1.attackBox.position.y + rectangle1.attackBox.height >= rectangle2.position.y &&
        rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
}

function determineWinner({ player, enemy, timer }) {
    clearTimeout(timer);
    document.querySelector("#result").style.display = "grid";
    if (player.health === enemy.health) {
        document.querySelector("#result").innerHTML = "Tie";
    } else if (player.health > enemy.health) {
        document.querySelector("#result").innerHTML = "Player 1 wins";
    } else if (player.health < enemy.health) {
        document.querySelector("#result").innerHTML = "Player 2 wins";
    }
}

let time = 60;
let timer;
function decreaseTimer() {
    if (time > 0) {
        timer = setTimeout(decreaseTimer, 1000);
        time--;
        document.querySelector("#timer").innerHTML = time;
    } else {
        determineWinner({ player, enemy, timer });
    }
}

decreaseTimer();

function animate() {
    window.requestAnimationFrame(animate);
    c.fillStyle = "black";
    c.fillRect(0, 0, canvas.width, canvas.height);
    background.update();
    player.update();
    enemy.update();
    player.velocity.x = 0
    enemy.velocity.x = 0

    // player movement
    if (key.a.pressed && player.lastKey === "a") {
        player.velocity.x = -5
    } else if (key.d.pressed && player.lastKey === "d") {
        player.velocity.x = 5
    }

    // enemy movement
    if (key.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
        enemy.velocity.x = -5
    } else if (key.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
        enemy.velocity.x = 5
    }

    // detect for cllision
    if (rectangularCollision({ rectangle1: player, rectangle2: enemy }) && player.isAttacking) {
        player.isAttacking = false;
        enemy.health -= 20;
        document.querySelector("#enemyHealth").style.width = enemy.health + "%";
    }
    if (rectangularCollision({ rectangle1: enemy, rectangle2: player }) && enemy.isAttacking) {
        enemy.isAttacking = false
        player.health -= 20;
        document.querySelector("#playerHealth").style.width = player.health + "%";
    }

    // end the game based on health
    if (enemy.health <= 0 || player.health <= 0) {
        determineWinner({ player, enemy, timer });
    }
}

animate();

window.addEventListener("keydown", (e) => {
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
            player.velocity.y = -20;
            break;
        case " ":
            player.attack();
            break;
        case "ArrowRight":
            key.ArrowRight.pressed = true;
            enemy.lastKey = "ArrowRight";
            break;
        case "ArrowLeft":
            key.ArrowLeft.pressed = true;
            enemy.lastKey = "ArrowLeft";
            break;
        case "ArrowUp":
            enemy.velocity.y = -20;
            break;
        case "ArrowDown":
            enemy.attack();
            break;
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
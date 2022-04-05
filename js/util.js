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
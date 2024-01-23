//detect collision of objects
function collision({ object1, object2 }) {

    return (
        (object1.attackbox.position.x + object1.attackbox.width >= object2.position.x) &&
        (object1.attackbox.position.x <= object2.position.x + object2.image.width) &&
        (object1.attackbox.position.y + object1.attackbox.height >= object2.position.y) &&
        (object1.attackbox.position.y <= object2.position.y + object2.image.height)
    )
}

//result of the game
function determine_winner({ player, enemy, timercount }) {
    //stoping the timer
    clearTimeout(timercount)
    document.querySelector('#result').style.display = 'flex'
    if (player.health === enemy.health) {
        document.querySelector('#result').innerHTML = 'Draw'
    }
    else if (player.health > enemy.health) { 
        document.querySelector('#result').innerHTML = 'Dominant Dhruvil is Winner'
    }
    else if (enemy.health > player.health) {
        document.querySelector('#result').innerHTML = 'Supreme jaimin is Winner'
    }
}

// timer
let timer = 60
let timercount
function decrease_timer() {
    if (timer > 0) {
        timercount = setTimeout(decrease_timer, 1000)
        timer--
        document.querySelector('#timer').innerHTML = timer
    }

    //ending the game and determing the winner if anyone's health is over
    if (player.health <= 0 || enemy.health <= 0) {
        determine_winner({ player, enemy, timercount })
    }
    //determing result when time is over
    if (timer == 0) {
        determine_winner({ player, enemy, timercount })
    }
}
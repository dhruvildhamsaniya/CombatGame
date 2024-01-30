const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

//game space
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

// Optional: Add an event listener to update the canvas dimensions when the window is resized
window.addEventListener('resize', () => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  // You may also want to redraw your content if needed when the window is resized.
});

//gravity to keep object at the surface , after jump object will come down . 
const gravity = 0.2

const background = new sprite({
    position: {
        x: 0,
        y: 0
    },
    imagesrc: './images/shadowfight.jpg',
    flip: 0,
    flag: 'background'
})

// objects
const player = new fighter({
    position: {
        x: 200,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    offset: {
        x: 200,
        y: 332
    },
    sprites: {
        idle: {
            imagePaths: player_idle,
            framesmax: 8
        },
        
        run: {
            imagePaths: player_run,
            framesmax: 8
        },
        jump_up: {
            imagePaths: player_jump_up,
            framesmax: 10
        },
        jump_down: {
            imagePaths: player_jump_down,
            framesmax: 10
        },
        attack: {
            imagePaths: player_attack,
            framesmax: 12
        },
        take_hit: {
            imagePaths: player_takehit,
            framesmax: 6
        },
        death: {
            imagePaths: player_death,
            framesmax: 13
        }
    },
    attackbox: {
        offset: {
            x: 100,
            y: 0
        },
        width: 300,
        height: 60
    },
    imagesrc: './images/player/fire_knight/01_idle/idle_1.png',
    // framesmax :8,
    scale: 3,
    flip: 0,
    flag:'fighter'

})

const enemy = new fighter({
    position: {
        x: 1000,
        y: 0
    },
    velocity: {
        x: 0,
        y: 0
    },
    //offset to point enemy attackbox in opposite direction
    offset: {
        x: 200,
        y: 332
    },
    sprites: {
        idle: {
            imagePaths: enemy_idle,
            framesmax: 8
        },
        run: {
            imagePaths: enemy_run,
            framesmax: 8
        },
        jump_up: {
            imagePaths: enemy_jump_up,
            framesmax: 3
        },
        jump_down: {
            imagePaths: enemy_jump_down,
            framesmax: 3
        },
        attack: {
            imagePaths: enemy_attack,
            framesmax: 15
        },
        take_hit: {
            imagePaths: enemy_takehit,
            framesmax: 6
        },
        death: {
            imagePaths: enemy_death,
            framesmax: 19
        }
    },
    attackbox: {
        offset: {
            x: -220,
            y: 0
        },
        width: 300,
        height: 60
    },
    imagesrc: './images/enemy/PNG/idle/idle_1.png',
    scale: 3,
    flip: 1,
    flag:'fighter'
})

const keys = {
    d: {
        pressed: false
    },
    a: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    // x:{
    //     pressed: false
    // }
}

decrease_timer()

// function will be called recursively to animate our object frame by frame
function animate() {
    window.requestAnimationFrame(animate)

    background.update()

    //adding a slight white background layer to make our fighters clearly visible and seperate out from background image
    c.fillStyle = 'rgba(255 ,255, 255, 0.1)'
    c.fillRect(0, 0, canvas.width, canvas.height)

    player.update()
    enemy.update()

    //bydefault velocity should be 0
    player.velocity.x = 0
    enemy.velocity.x = 0

    //incase user inputs multiple keys at a time this will make sure that object functions according to last key pressed
    //for player movement 

    if (keys.d.pressed && player.lastkey === 'd') {
        player.velocity.x = 5
        //switchState for player to run
        player.switchsprite('run')
    }
    else if (keys.a.pressed && player.lastkey === 'a') {
        player.velocity.x = -5
        player.switchsprite('run')
    }
    // else if (keys.x.pressed && player.lastkey == 'x') {
    //     player.attack()
    // }
    else {
        player.switchsprite('idle')
    }

    if (player.velocity.y < 0) {
        player.switchsprite('jump_up')
    }
    else if (player.velocity.y > 0) {
        player.switchsprite('jump_down')
    }

    // for enemy movement
    if (keys.ArrowLeft.pressed && enemy.lastkey === 'ArrowLeft') {
        enemy.velocity.x = -5
        enemy.switchsprite('run')
    }
    else if (keys.ArrowRight.pressed && enemy.lastkey === 'ArrowRight') {
        enemy.velocity.x = 5
        enemy.switchsprite('run')
    }
    else {
        enemy.switchsprite('idle')
    }

    if (enemy.velocity.y < 0) {
        enemy.switchsprite('jump_up')
    }
    else if (enemy.velocity.y > 0) {
        enemy.switchsprite('jump_down')
    }

    //check collision detection and enemy hit animation
    if (collision({ object1: player, object2: enemy }) &&
        player.isattacking &&
        player.framescurrent == 5) {
            
        player.isattacking = false
        enemy.takehit()
      
        document.querySelector('#enemyhealth').style.width = enemy.health + '%'
        //decreasing health from healthbar with smooth animation
        // gsap.to('#enemyhealth', {
        //     width: enemy.health + '%'
        // })

    }
    // if player misses
    if (player.isattacking && player.framescurrent == 5) {
        player.isattacking = false
    }

 //check collision detection and player hit animation
    if (collision({ object1: enemy, object2: player }) &&
        enemy.isattacking &&
        enemy.framescurrent == 5) {

        enemy.isattacking = false
        player.takehit()

        document.querySelector('#playerhealth').style.width = player.health + '%'
        // gsap.to('#playerhealth', {
        //     width: player.health + '%'
        // })
    }
    // if enemy misses
    if (enemy.isattacking && enemy.framescurrent == 5) {
        enemy.isattacking = false
    }

    //facing  correct direction of sprite
    if(player.position.x > enemy.position.x){
        player.flip = 1
        enemy.flip = 0
    }
    else{
        player.flip = 0
        enemy.flip = 1
    }

}

animate()

//user interaction like moving right , left and jump

window.addEventListener('keydown', (Event) => {

    //if player is dead then we restrict on other movements
    if(!player.dead){
    switch (Event.key) {
        case 'd':
            keys.d.pressed = true
            player.lastkey = 'd'
            break
        case 'a':
            keys.a.pressed = true
            player.lastkey = 'a'
            break
        case 'w':
            player.velocity.y = -10
            break
        case 'x':
            // keys.x.pressed = true
            // player.lastkey = 'x'
            player.attack()
            break
        }
    }
        //if enemy is dead then we restrict on other movements
    if(!enemy.dead){
        switch (Event.key) {
        case 'ArrowRight':
            keys.ArrowRight.pressed = true
            enemy.lastkey = 'ArrowRight'
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = true
            enemy.lastkey = 'ArrowLeft'
            break
        case 'ArrowUp':
            enemy.velocity.y = -10
            break
        case ' ':
            enemy.attack()
            break
        }
    }
})

window.addEventListener('keyup', (Event) => {
    switch (Event.key) {
        case 'd':
            keys.d.pressed = false
            break
        case 'a':
            keys.a.pressed = false
            break
        case 'ArrowRight':
            keys.ArrowRight.pressed = false
            break
        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false
            break
        // case 'x':
        //     keys.x.pressed = false
        //     break
    }
})

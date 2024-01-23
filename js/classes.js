
//class sprite starts
// Sprites are 2D images that represent game objects, such as characters or items.
class sprite {
    constructor({ position, imagesrc, scale = 1, framesmax = 1, offset = { x: 0, y: 0 }, sprites, flip, flag }) {
        this.position = position
        // this.height = 150
        // this.width = 50
        this.image = new Image()
        this.image.src = imagesrc
        //to increase the size of our object
        this.scale = scale
        //no. of frames in our image to be animated
        this.framesmax = framesmax
        this.framescurrent = 0
        //how many frames we have elapsed over our complete animation
        this.frameselapsed = 0
        //how many frames should we go through before we change our framescurrent
        this.frameshold = 10
        this.offset = offset
        this.sprites = sprites
        // to flip the sprite for facing in correct direction
        this.flip = flip
        this.flag = flag
    }

    drawBackgroundImage() {
          
          const scaleFactor = Math.max(canvas.width / this.image.width, canvas.height / this.image.height);
          const newWidth = this.image.width * scaleFactor;
          const newHeight = this.image.height * scaleFactor;
      
          const x = (canvas.width - newWidth) / 2;
          const y = (canvas.height - newHeight) / 2;
      
          c.drawImage(this.image, x, y, newWidth, newHeight);
        
      }

    draw() {
        if (this.flip) {

            c.scale(-1, 1)

            c.drawImage(
                this.image,
                0,
                0,
                this.image.width,
                this.image.height,
                -this.position.x - this.image.width - this.offset.x,
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
           
        }
        else {
            c.drawImage(
                this.image,
                0,
                0,
                this.image.width,
                this.image.height,
                this.position.x - this.offset.x,
                this.position.y - this.offset.y,
                this.image.width * this.scale,
                this.image.height * this.scale
            )
        }
    }

    //applying animation for our characters
    animation(state = 'idle') {
        this.frameselapsed++
        if (this.frameselapsed % this.frameshold == 0) {
            if (this.framescurrent < this.framesmax - 1) {

                this.framescurrent++
                this.image.src = this.sprites[state].imagePaths[this.framescurrent];

            }
            else {
                this.framescurrent = 0
            }
        }

    }

    update() {
        if(this.flag == 'background'){
            this.drawBackgroundImage()
        }
        else{
        this.draw()
        }
        this.animation()
    }
}
// class sprite ends

//class fighter starts
// extends is used to inherit properties and methods from parent class
// here fighter is child and sprite is parent class
class fighter extends sprite {
    constructor({ position,
        velocity,
        offset = { x: 0, y: 0 },
        sprites,
        imagesrc,
        scale = 1,
        framesmax = 1,
        flip,
        attackbox = { offset: {}, width: undefined, height: undefined }
    }) {
        //super() is used to call constructer of parent class. it is a keyword
        super({
            position,
            imagesrc,
            offset,
            scale,
            framesmax,
            sprites,
            flip
        })
       
        // to track which was the last key pressed by user in case user presses multiple keys at a time
        this.lastkey
        //velocity for which direction and how much movement
        this.velocity = velocity
        //this.color = color

        this.attackbox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackbox.offset,
            width: attackbox.width,
            height: attackbox.height
        }
        this.isattacking
        this.health = 100
        this.framescurrent = 0
        this.frameselapsed = 0
        this.frameshold = 10
         // here idle ,run , jump ,attack etc our sprites
        this.sprites = sprites
        //state for switching different sprites,tracking which is the current state of sprite .
        this.state
        this.flip = flip
        //to track if the fighter is dead or not
        this.dead = false
    }

    // making our object move
    update() {
        this.draw()

        //if fighter is dead we wont call animation
        if(!this.dead){
        this.animation(this.state)
        }
        // making the object move by changing the position
        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        //drawing attackbox
        // c.fillRect(this.attackbox.position.x,
        //      this.attackbox.position.y,
        //       this.attackbox.width,
        //        this.attackbox.height )

        //keeping attackbox attached with the object
        this.attackbox.position.x = this.position.x + this.attackbox.offset.x
        this.attackbox.position.y = this.position.y + this.attackbox.offset.y

        // making sure that the object does not go out of our game space 
        if (this.position.y + this.image.height + this.velocity.y >= canvas.height) {
            this.velocity.y = 0
        }
        else {
            this.velocity.y += gravity
        }

    }

    //attack activity
    attack() {
        this.isattacking = true
        this.state = 'attack'
        this.framesmax = this.sprites.attack.framesmax
        this.switchsprite('attack')
    
    }

    takehit() {
        //decreasing health if collision has occured
        this.health -= 10

        this.state = 'take_hit'
        this.framesmax = this.sprites.take_hit.framesmax

        //checking if fighter is dead or not
        if(this.health <= 0){
            this.state = 'death'
            this.framesmax = this.sprites.death.framesmax
            this.switchsprite('death')
        }
        else{
        this.switchsprite('take_hit')
        }
    }

    switchsprite(state) {

         //overriding all other animation when death animation is called
         if (this.state == 'death'){
           if(this.framescurrent === this.sprites.death.framesmax - 1)
            {
                this.dead = true
            }
            return
        }

        //overriding all other animation when attack animation is called
        if (this.state == 'attack' && this.framescurrent < this.sprites.attack.framesmax - 1) {
            return
        }
        //overriding all other animation when takehit animation is called
        if (this.state == 'take_hit' && this.framescurrent < this.sprites.take_hit.framesmax - 1) {
            return
        }

        switch (state) {

            case 'idle':
                this.state = 'idle'
                this.framesmax = this.sprites.idle.framesmax
                break;

            case 'run':
                this.state = 'run'
                this.framesmax = this.sprites.run.framesmax
                break;

            case 'jump_up':
                this.state = 'jump_up'
                this.framesmax = this.sprites.jump_up.framesmax
                break;

            case 'jump_down':
                this.state = 'jump_down'
                this.framesmax = this.sprites.jump_down.framesmax
                break;

            default:
                break;
        }
    }
}
// class fighter end

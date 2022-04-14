class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }
    //------------------------------------------------------------
    //Made By Peyton Jones
    //Modded Rocket Patrol
    //Date:    4/13/2022
    //It took me about 5 hours to add the modifications
    //------------------------------------------------------------

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceshiptwo', './assets/spaceshiptwo.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        //load particle images
        this.load.image('spark', './assets/spark.png');
      }

    create(){
        // place tile sprite
        this.starfield = this.add.tileSprite(0, 0, 640, 480, 'starfield').setOrigin(0, 0);
        //Green UI Background
        this.add.rectangle(0, borderUISize + borderPadding, game.config.width, borderUISize * 2, 0x00ff00).setOrigin(0,0);
        //White borders
        this.add.rectangle(0, 0, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, game.config.height - borderUISize, game.config.width, borderUISize, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(0, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(game.config.width - borderUISize, 0, borderUISize, game.config.height, 0xFFFFFF).setOrigin(0, 0);
        let separate = 0;
        if (game.settings.coop){
            separate  = 30;
        }
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, (game.config.width/2) - separate, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        // add rocket (p2)
        if (game.settings.coop){
            this.p2Rocket = new RocketTwo(this, (game.config.width/2) + separate, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        }
        
        //spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4+48, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2+48, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4+48, 'spaceship', 0, 10).setOrigin(0,0);
        this.ship04 = new SpaceshipTwo(this, game.config.width, borderUISize*4, 'spaceshiptwo', 0, 80).setOrigin(0,0);
        // define keys
        keyA = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
        keyW = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
        keyD = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        if (game.settings.coop){
            keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);
            keyUP = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.UP);
        }

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // initialize score
        this.p1Score = 0;
        this.p2Score = 0;
        //initialize timers
        this.p1Timer = 60;
        this.p2Timer = 60;
        // display score
        this.scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }
        this.scoreLeft = this.add.text(borderUISize + borderPadding, borderUISize + borderPadding*2, this.p1Score, this.scoreConfig);
        if (game.settings.coop)this.scoreRight = this.add.text(game.config.width - borderPadding*15 - 100, borderUISize + borderPadding*2, this.p2Score, this.scoreConfig);
        this.timerLeft = this.add.text(borderUISize + borderPadding + 100, borderUISize + borderPadding*2, this.p1Timer, this.scoreConfig);
        if (game.settings.coop)this.timerRight = this.add.text(game.config.width - borderPadding*15, borderUISize + borderPadding*2, this.p2Timer, this.scoreConfig);

        // GAME OVER flag
        this.gameOver = false;

        // 60-second play clock
        this.scoreConfig.fixedWidth = 0;
        this.p1Clock = this.time.delayedCall(game.settings.gameTimer, () => {
            console.log("Delayed Call Finished: P1");
        }, null, this);
        this.p2Clock = this.time.delayedCall(game.settings.gameTimer, () => {
            console.log("Delayed Call Finished: P2");
        }, null, this);

        //particles
        var particles = this.add.particles('spark');
        this.emitter = particles.createEmitter();
        this.emitter.setPosition(100, 100);
        this.emitter.setSpeed(50);
        this.emitter.true = false;
        this.emitter.explode(1, -100, -100);
        this.gameOver = false;
    }
    update() {
        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyR)) {
            this.scene.restart();
        }
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.scene.start("menuScene");
        }
        this.starfield.tilePositionX -= 1;
        if (!this.gameOver) {               
            this.p1Rocket.update();         // update rocket sprite
            if (game.settings.coop)this.p2Rocket.update();
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
            this.ship04.update();
        }
        //checking for timers running out:
        if (!game.settings.coop){
            if (this.p1Timer <= 0){
                this.add.text(game.config.width/2, game.config.height/2, 'Game Over', this.scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for menu', this.scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
            }
        }
        if (game.settings.coop)
        if (!this.gameOver){
            if (this.p1Timer <= 0){
                if (this.p2Timer <= 0){
                    //Tie game
                    this.add.text(game.config.width/2, game.config.height/2, 'Its a Tie!', this.scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for menu', this.scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                }else{
                    //P2 Wins
                    this.add.text(game.config.width/2, game.config.height/2, 'P2 Wins!', this.scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for menu', this.scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                }
                
            }
            if (this.p2Timer <= 0){
                if (this.p1Timer <= 0){
                    //Tie game
                    this.add.text(game.config.width/2, game.config.height/2, 'Its a Tie!', this.scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for menu', this.scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                } else{
                    //P1 Wins
                    this.add.text(game.config.width/2, game.config.height/2, 'P1 Wins!', this.scoreConfig).setOrigin(0.5);
                    this.add.text(game.config.width/2, game.config.height/2 + 64, 'Press (R) to Restart or <- for menu', this.scoreConfig).setOrigin(0.5);
                    this.gameOver = true;
                }
                
            }

        }
        if(this.gameOver == true){
            this.p1Clock.destroy();
            this.p2Clock.destroy();
        }

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship04)) {
            console.log('kaboom ship 04 by p1');
            this.p1Rocket.reset();
            this.shipExplode(this.ship04, 1); 
        }
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log('kaboom ship 03 by p1');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03, 1); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log('kaboom ship 02 by p1');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02, 1); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log('kaboom ship 01 by p1');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01, 1); 
        }
        if (game.settings.coop)if(this.checkCollision(this.p2Rocket, this.ship04)) {
            console.log('kaboom ship 04 by p2');
            this.p2Rocket.reset();
            this.shipExplode(this.ship04, 2); 
        }
        if (game.settings.coop)if(this.checkCollision(this.p2Rocket, this.ship03)) {
            console.log('kaboom ship 03 by p2');
            this.p2Rocket.reset();
            this.shipExplode(this.ship03, 2); 
        }
        if (game.settings.coop)if (this.checkCollision(this.p2Rocket, this.ship02)) {
            console.log('kaboom ship 02 by p2');
            this.p2Rocket.reset();
            this.shipExplode(this.ship02, 2); 
        }
        if (game.settings.coop)if (this.checkCollision(this.p2Rocket, this.ship01)) {
            console.log('kaboom ship 01 by p2');
            this.p2Rocket.reset();
            this.shipExplode(this.ship01, 2); 
        }

        this.p1Timer = this.p1Clock.getRemainingSeconds();
        this.p2Timer = this.p2Clock.getRemainingSeconds();
        if (!this.gameOver){
            this.timerLeft.text = Math.floor(this.p1Timer);
            if (game.settings.coop)this.timerRight.text = Math.floor(this.p2Timer);
        }
        
        

    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width && 
            rocket.x + rocket.width > ship.x && 
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship. y) {
                return true;
        } else {
            return false;
        }
    }

    shipExplode(ship, pNumber) {
        //ship y position
        let storeY = ship.y;
        // temporarily hide ship
        // ship.alpha = 0;
        ship.y = -100;
        //create emitter explosion:
        this.emitter.explode(3, ship.x, storeY);
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, storeY, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.y = storeY;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        this.sound.play('sfx_explosion'); 
        if (pNumber == 1){
            // score add and repaint
            this.p1Score += ship.points;
            this.scoreLeft.text = this.p1Score;
            this.AddTime(1, (ship.points/10)*2);
        }else{
            // score add and repaint
            this.p2Score += ship.points;
            this.scoreRight.text = this.p2Score;
            this.AddTime(2, (ship.points/10)*2);
        }
          
    }

    AddTime(Clock, Time){
        if (Clock == 1){
            let remainingTime = this.p1Clock.getRemaining();
            this.p1Clock.destroy();
            this.p1Clock = this.time.delayedCall(remainingTime + (Time * 1000), () => {
                console.log("Delayed Call Finished (ext.)");
            }, null, this);
        }else{
            let remainingTime = this.p2Clock.getRemaining();
            this.p2Clock.destroy();
            this.p2Clock = this.time.delayedCall(remainingTime + (Time * 1000), () => {
                console.log("Delayed Call Finished (ext.)");
            }, null, this);
        }
    }



}
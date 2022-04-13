class Play extends Phaser.Scene {
    constructor(){
        super("playScene");
    }

    preload() {
        // load images/tile sprites
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('starfield', './assets/starfield.png');
        // load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
        
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
        // add rocket (p1)
        this.p1Rocket = new Rocket(this, game.config.width/2, game.config.height - borderUISize - borderPadding, 'rocket').setOrigin(0.5, 0);
        //spaceships
        this.ship01 = new Spaceship(this, game.config.width + borderUISize*6, borderUISize*4, 'spaceship', 0, 30).setOrigin(0, 0);
        this.ship02 = new Spaceship(this, game.config.width + borderUISize*3, borderUISize*5 + borderPadding*2, 'spaceship', 0, 20).setOrigin(0,0);
        this.ship03 = new Spaceship(this, game.config.width, borderUISize*6 + borderPadding*4, 'spaceship', 0, 10).setOrigin(0,0);
        // define keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyR = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.R);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

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
        this.scoreRight = this.add.text(game.config.width - borderPadding*15 - 100, borderUISize + borderPadding*2, this.p2Score, this.scoreConfig);
        this.timerLeft = this.add.text(borderUISize + borderPadding + 100, borderUISize + borderPadding*2, this.p1Timer, this.scoreConfig);
        this.timerRight = this.add.text(game.config.width - borderPadding*15, borderUISize + borderPadding*2, this.p2Timer, this.scoreConfig);

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
            this.ship01.update();           // update spaceships (x3)
            this.ship02.update();
            this.ship03.update();
        }
        //checking for timers running out:
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

        // check collisions
        if(this.checkCollision(this.p1Rocket, this.ship03)) {
            console.log('kaboom ship 03');
            this.p1Rocket.reset();
            this.shipExplode(this.ship03); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            console.log('kaboom ship 02');
            this.p1Rocket.reset();
            this.shipExplode(this.ship02); 
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            console.log('kaboom ship 01');
            this.p1Rocket.reset();
            this.shipExplode(this.ship01); 
        }

        this.p1Timer = this.p1Clock.getRemainingSeconds();
        this.p2Timer = this.p2Clock.getRemainingSeconds();
        this.timerLeft.text = Math.floor(this.p1Timer);
        this.timerRight.text = Math.floor(this.p2Timer);
        

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

    shipExplode(ship) {
        // temporarily hide ship
        ship.alpha = 0;
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode');             // play explode animation
        boom.on('animationcomplete', () => {    // callback after anim completes
          ship.reset();                         // reset ship position
          ship.alpha = 1;                       // make ship visible again
          boom.destroy();                       // remove explosion sprite
        });
        // score add and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;     
        this.sound.play('sfx_explosion');   
    }

    AddTime(Timer, Time){
        Timer.destroy();

    }

}
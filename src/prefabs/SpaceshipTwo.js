class SpaceshipTwo extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        //add object to existing scene dawg
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed * 2;
    }

    update() {
        //move spaceship to the left
        this.x -= this.moveSpeed;
        //wrap around the left edge of game window to the right
        if(this.x <= -4000 - this.width){
            this.x = game.config.width;
        }
    }
    
    //position resetting
    reset () {
        this.x = game.config.width;
    }
}
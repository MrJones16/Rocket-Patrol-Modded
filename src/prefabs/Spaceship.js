class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointValue){
        super(scene, x, y, texture, frame);
        //add object to existing scene dawg
        scene.add.existing(this);
        this.points = pointValue;
        this.moveSpeed = game.settings.spaceshipSpeed;
    }

    //------------------------------------------------------------
    //Made By Peyton Jones
    //Modded Rocket Patrol
    //Date:    4/13/2022
    //It took me about 5 hours to add the modifications
    //------------------------------------------------------------

    update() {
        //move spaceship to the left
        this.x -= this.moveSpeed;
        //wrap around the left edge of game window to the right
        if(this.x <= 0 - this.width){
            this.x = game.config.width;
        }
    }
    
    //position resetting
    reset () {
        this.x = game.config.width;
    }
}
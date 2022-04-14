    //------------------------------------------------------------
    //Made By Peyton Jones
    //Modded Rocket Patrol
    //Date:    4/13/2022
    //It took me about 5 hours to add the modifications
    //------------------------------------------------------------
    //POINT BREAKDOWN:
    //Two player - 30 pts                         
    //Display the time remaining - 10pts          
    //Add time for successfull hits - 20pts       
    //Small faster ship that is worth more - 20pts
    //Try out the phaser particle system - 20pts  
    //
    //        |Total Points: 100|
    //
    //Note: I created two seperate time counters, one for each player.
    //I also made sure to make it so you can still play single-player.
    //
    //Sources:
    //My Classmate and team-member Dominic helped me understande Phaser's
    //timer and clock object.
    //For understanding Phaser's particle emitter system, I read online at:
    //https://photonstorm.github.io/phaser3-docs/Phaser.GameObjects.Particles.ParticleEmitter.html
    //and watched this youtube video:
    //https://www.youtube.com/watch?v=LEDPCfot_GY
    //
    //Thanks!


let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [Menu, Play]
  }

let game = new Phaser.Game(config);
let borderUISize = game.config.height / 15;
let borderPadding = borderUISize / 3;
let keyA, keyW, keyD, keyR, keyLEFT, keyUP, keyRIGHT;


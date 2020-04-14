let config = {
    type: Phaser.CANVAS,
    width: 640,
    height: 480,
    scene: [ Menu, Play ], //Order important
};

let game = new Phaser.Game(config);

// define game setings
game.settings = {
    spaceshipSpeed: 3,
    gameTimer: 60000,
    highScore: 1,
}

game.global = {
    highScore: 0, // player high score
    music: 'rocket_music', // background music
    initSpeed: 3, // initial speed of spaceships
}

// reserve some keyboard variables
let keyF, keyLEFT, keyRIGHT;


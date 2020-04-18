// Play.js
class Play extends Phaser.Scene {
    constructor() {
        super("playScene");
    }

    preload() {
        // load images/tile sprite
        this.load.image('rocket', './assets/rocket.png');
        this.load.image('spaceship', './assets/spaceship.png');
        this.load.image('spaceship_flip', './assets/spaceship_flip.png');
        this.load.image('starfield', './assets/starfield.png');

        //load spritesheet
        this.load.spritesheet('explosion', './assets/explosion.png', {frameWidth: 64, frameHeight: 32, startFrame: 0, endFrame: 9});
    }

    create() {
        
        // place tilesprite
        this.starfield = this.add.tileSprite(0 , 0, 640, 480, 'starfield').setOrigin(0, 0);

        // white rectangle borders
        this.add.rectangle(5, 5, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 443, 630, 32, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(5, 5, 32, 455, 0xFFFFFF).setOrigin(0, 0);
        this.add.rectangle(603, 5, 32, 445, 0xFFFFFF).setOrigin(0, 0);
        // green UI background
        this.add.rectangle(37, 42, 566, 64, 0x00FF00).setOrigin(0,0);

        // add rocket (p1)
        // constructor(scene, x, y, texture, frame)
        this.p1Rocket = new Rocket(this, game.config.width/2, 431,
            'rocket').setScale(0.5, 0.5).setOrigin(0, 0);

        // 1st Spaceship
        if(Phaser.Math.Between(1, 2) == 1){
            //right
            this.ship01 = new Spaceship(this, game.config.width+192, 132, 'spaceship', 0, 30, 0).setOrigin(0, 0);
        } else {
            //left
            this.ship01 = new Spaceship(this, 192, 132, 'spaceship_flip', 0, 30, 1).setOrigin(0, 0);
        }

        // 2nd Spaceship
        if(Phaser.Math.Between(1, 2) == 1){
            //right
            this.ship02 = new Spaceship(this, game.config.width+96, 196, 'spaceship', 0, 20, 0).setOrigin(0, 0);
        } else {
            //left
            this.ship02 = new Spaceship(this, 96, 196, 'spaceship_flip', 0, 20, 1).setOrigin(0, 0);
        }

        // 3rd Spaceship
        if(Phaser.Math.Between(1, 2) == 1){
            //right
            this.ship03 = new Spaceship(this, game.config.width, 260, 'spaceship', 0, 10, 0).setOrigin(0, 0);
        } else {
            //left
            this.ship03 = new Spaceship(this, 0, 260, 'spaceship_flip', 0, 10, 1).setOrigin(0, 0);
        }


        // define keyboard keys
        keyF = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.F);
        keyLEFT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT);
        keyRIGHT = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT);

        // animation config
        this.anims.create({
            key: 'explode',
            frames: this.anims.generateFrameNumbers('explosion', { start: 0, end: 9, first: 0}),
            frameRate: 30
        });

        // score
        /*Note that we’re also initializing the score to zero. And we’re doing 
        this in the create() method, because we want the score initialization to 
        happen once, when the scene is created, but before the update loop begins.
        */
        this.p1Score = 0;
        

        // score display
        let scoreConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'center',
            padding: {
                top: 5,
                bottom: 5,
            },
            fixedWidth: 100
        }

        let textConfig = {
            fontFamily: 'Courier',
            fontSize: '28px',
            backgroundColor: '#F3B141',
            color: '#843605',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
            //fixedWidth: 150
        }

        // Actual Text
        this.scoreLeft = this.add.text(55, 54, this.p1Score, scoreConfig);
        this.highScoreRight = this.add.text(485, 54, game.global.highScore, scoreConfig);
        this.highScoreText = this.add.text(303, 54, 'High', textConfig);
        this.highScoreText = this.add.text(385, 54, 'Score', textConfig);

        // game over flag
        this.gameOver = false;

        // 60-Second play clock
        scoreConfig.fixedWidth = 0;
        this.clock = this.time.delayedCall(game.settings.gameTimer, () => {
            game.global.music.setVolume(0);
            this.add.text(game.config.width/2, game.config.height/2 - 32, 'GAME OVER', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 32, '(F)ire to Restart or ← for Menu', scoreConfig).setOrigin(0.5);
            this.add.text(game.config.width/2, game.config.height/2 + 96, 'High Score: ' + game.global.highScore, scoreConfig).setOrigin(0.5);
            this.gameOver = true;
        }, null, this);

        // 30 seconds in, speed up spaceships by magnitude of 1.5
        this.clock = this.time.delayedCall(30000, () => {
            // console.log('SPEEDING UP');
            game.settings.spaceshipSpeed = game.global.initSpeed * 1.5;
        }, null, this);

        // set initial speed of spaceships
        game.global.initSpeed = game.settings.spaceshipSpeed;

        // *** TIMER ***

        this.startTime = new Date();
        this.totalTime = game.settings.gameTimer / 1000;
        this.timeElapsed = 0;

        this.createTimer();

        // *** TIMER ***

    }

    update() {

        this.gameTimer = this.time.delayedCall(100, () => {
            this.updateTimer();
        }, null, this);

        // check key input for restart
        if (this.gameOver && Phaser.Input.Keyboard.JustDown(keyF)) {
            this.sound.play('sfx_select');
            game.settings.spaceshipSpeed = game.global.initSpeed;
            game.global.music.setVolume(0.2);
            this.scene.restart();
        }

        if(this.gameOver && Phaser.Input.Keyboard.JustDown(keyLEFT)) {
            this.sound.play('sfx_select');
            this.scene.start("menuScene");
        }

        // scroll starfield
        this.starfield.tilePositionX -= 2.5;

        if (!this.gameOver) {
            // update rocket
            this.p1Rocket.update();

            // update spaceship
            this.ship01.update();
            this.ship02.update();
            this.ship03.update();
        }

        // check collisions
        
        if (this.checkCollision(this.p1Rocket, this.ship03)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship03);
        }
        if (this.checkCollision(this.p1Rocket, this.ship02)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship02);
        }
        if (this.checkCollision(this.p1Rocket, this.ship01)) {
            this.p1Rocket.reset();
            this.shipExplode(this.ship01);
        }
    }

    checkCollision(rocket, ship) {
        // simple AABB checking
        if (rocket.x < ship.x + ship.width &&
            rocket.x + rocket.width > ship.x &&
            rocket.y < ship.y + ship.height &&
            rocket.height + rocket.y > ship.y) {
                return true;
            } else {
                return false;
            }
    }

    shipExplode(ship) {
        ship.alpha = 0; //temporarily hide ship
        // create explosion sprite at ship's position
        let boom = this.add.sprite(ship.x, ship.y, 'explosion').setOrigin(0, 0);
        boom.anims.play('explode'); // play explode animation
        boom.on('animationcomplete', () => { // callback after animation completes
            ship.reset(); //reset ship position
            ship.alpha = 1; // set ship to visible again
            boom.destroy(); //remove explosion sprite
        });
        // score increment and repaint
        this.p1Score += ship.points;
        this.scoreLeft.text = this.p1Score;

        // High score update
        if (this.p1Score > game.global.highScore) {
            game.global.highScore = this.p1Score;
            this.highScoreRight.text = this.p1Score;
        }

        // play one of 5 explosion sfx
        switch (Phaser.Math.Between(0,4)) {
            case 0:
                this.sound.play('sfx_explosion');
                break;
            case 1:
                this.sound.play('sfx_explosion1');
                break;
            case 2:
                this.sound.play('sfx_explosion2');
                break;
            case 3:
                this.sound.play('sfx_explosion3');
                break;
            case 4: 
                this.sound.play('sfx_explosion4');
                break;
        }
    }

    // timer text config and display
    createTimer() {

        // for the text showing game time left
        let timeTextConfig = {
            fontFamily: 'Courier',
            fontSize: '23px',
            backgroundColor: '#D8D7D7',
            color: '#000000',
            align: 'right',
            padding: {
                top: 5,
                bottom: 5,
            },
        }
        
        this.timeLabel = this.add.text(314, 444, game.settings.gameTimer/1000, timeTextConfig);
    }

    // Update the timer every second
    updateTimer() {
        var currentTime = new Date();
        var timeDifference = this.startTime.getTime() - currentTime.getTime();

        this.timeElapsed = Math.abs(timeDifference / 1000);

        var timeRemaining = this.totalTime - this.timeElapsed;

        var seconds = Math.floor(timeRemaining);

        var result = (seconds < 10) ? "" + seconds : "" + seconds;

        if (result >= 0){
            this.timeLabel.text = result;
        }
    }
}
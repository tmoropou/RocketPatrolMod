// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame, pointvalue) {
        super(scene, x, y, texture, frame);

        // add an object to the existing scene
        // basically add to displayList otherwise doesnt show up
        // Also adds to the updateList
        scene.add.existing(this);
        this.points = pointvalue;

    }

    update() {
        // move spaceship left
        if (game.settings.gameTimer < 30000){
            console.log('30 secs has passed');
            this.x -= game.settings.spaceshipSpeed;
        } else {
            this.x -= game.settings.spaceshipSpeed;
        }
        
        // wrap around screen bounds
        if (this.x <= 0 - this.width) {
            this.reset();
        }
    }

    // reset spaceship to "ground"
    reset() {
        this.x = game.config.width;
    }
}
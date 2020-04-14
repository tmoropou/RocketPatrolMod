// Spaceship prefab
class Spaceship extends Phaser.GameObjects.Sprite {
    // Direction: 0 = left, 1 = right
    constructor(scene, x, y, texture, frame, pointvalue, direction) {
        super(scene, x, y, texture, frame);

        // add an object to the existing scene
        // basically add to displayList otherwise doesnt show up
        // Also adds to the updateList
        scene.add.existing(this);
        this.points = pointvalue;
        this.dir = direction;
    }

    update() {
        if(this.dir == 1) {
            // move spaceship right
            this.x += game.settings.spaceshipSpeed;
        
            // wrap around screen bounds
            if (this.x >= game.config.width) {
                this.resetRight();
            }
        } else {
            // move spaceship left
            this.x -= game.settings.spaceshipSpeed;
        
            // wrap around screen bounds
            if (this.x <= 0 - this.width) {
                this.reset();
            }
        }
    }

    // reset spaceship to "ground"
    reset() {
        this.x = game.config.width;
    }

    // reset spaceship to "ground"
    resetRight() {
        this.x = 0;
    }
}
// Rocket prefab
class Rocket extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);

        // add an object to the existing scene
        // basically add to displayList otherwise doesnt show up
        //Also adds to the updateList
        scene.add.existing(this);
        this.isFiring = false; // track rockets firing status

        this.sfxRocket = scene.sound.add('sfx_rocket'); //add rocket sfx
    }

    update() {
        // left/right movement
        if(!this.isFiring) {
            if(keyLEFT.isDown && this.x >= 47) {
                this.x -= 2; //rocket speed
            } else if (keyRIGHT.isDown && this.x <= 578) {
                this.x += 2; // rocket speed
            }
        }
        // fire button
        if(Phaser.Input.Keyboard.JustDown(keyF) && !this.isFiring) {
            this.isFiring = true;
            this.sfxRocket.play(); // play sfx
        }
        // if fired, move up
        if(this.isFiring && this.y >= 100) {
            this.y -= 2;
        }
        //  reset on miss
        if(this.y <= 108) {
            this.reset();
        }
    }

    // reset rocket to "ground"
    reset() {
        this.isFiring = false;
        this.y = 431;
    }
}
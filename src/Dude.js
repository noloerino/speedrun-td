const DUDE_DMG_TO_BASE = 5;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
class Dude {

    /**
     * `speed` is a final property, given in terms of distance moved per update cycle
     * (should be fine-tuned)
     * `pos` is transient, and is the location of the dude relative to the coordinate grid.
     */
    constructor(pos, team, dir) {
        this.pos = pos;
        this.team = team;
        this.speed = 0.3;
        this.dir = dir;
    }

    update() {
        switch (this.dir) {
            case UP:
                this.pos.y -= this.speed;
                break;
            case DOWN:
                this.pos.y += this.speed;
                break;
            case LEFT:
                this.pos.x -= this.speed;
                break;
            case RIGHT:
                this.pos.x += this.speed;
                break;
        }
        // TODO figure out pathing
    }

    hitBase(base, removing) {
        removing.push(this);
    }
}

module.exports = Dude;
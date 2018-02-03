const THREE = require('three');

const DUDE_DMG_TO_BASE = 5;
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";
const TEAM_COLORS = {
    1: 0x41c4f4,
    2: 0xf44341,
};
const TEAM_DIRS = {
    1: RIGHT,
    2: LEFT,
};
class Dude {

    /**
     * `speed` is a final property, given in terms of distance moved per update cycle
     * (should be fine-tuned)
     * `pos` is transient, and is the location of the dude relative to the coordinate grid.
     */
    constructor(pos, team, dir) {
        this.pos = pos;
        this.team = team;
        this.speed = 0.1;
        this.dir = dir ? dir : TEAM_DIRS[team];
        this.color = TEAM_COLORS[team];
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
        this.updateRendering();
    }

    hitBase(base, removing) {
        base.hp -= DUDE_DMG_TO_BASE;
        removing.push(this);
    }

    updateRendering() {
        if (!this.rendering) {
            return;
        }
        this.rendering.position.set(this.pos.x, 0.4, this.pos.y);
    }

    initializeRendering() {
        var geometry = new THREE.BoxGeometry(0.3, 0.3, 0.3);
        var material = new THREE.MeshBasicMaterial({color: this.color});
        this.rendering = new THREE.Mesh(geometry, material);
        this.updateRendering();
        return this.rendering;
    }
}

module.exports = Dude;

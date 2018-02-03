const THREE = require('three');
const Vector2D = require('./Vector2D');
const Tile = require('./Tile');

// just for fun
var currentDirVector = new Vector2D(0, 1);
var updateDirVector = function() {
    var angle = Math.atan2(currentDirVector.y, currentDirVector.x);
    currentDirVector.x = Math.cos(angle + Math.PI/20);
    currentDirVector.y = Math.sin(angle + Math.PI/20);
    return currentDirVector.copy();
};
class Bullet {
    constructor(team, speed, pos, dirVector) {
        this.team = team;
        this.speed = speed;
        this.pos = pos;
        //this.dirVector = dirVector;
        this.dirVector = updateDirVector();
        this.color = Tile.teamColors[team];
    }

    update() {
        var angle = this.dirVector.direction();
        this.pos.x += this.speed * Math.cos(angle);
        this.pos.y += this.speed * Math.sin(angle);
        this.updateRendering();
    }

    updateRendering() {
        if (this.rendering) {
            this.rendering.position.set(this.pos.x, 0.5, this.pos.y);
        }
    }

    initializeRendering() {
        var geometry = new THREE.BoxGeometry(0.1, 0.1, 0.1);
        var material = new THREE.MeshBasicMaterial({color: this.color});
        this.rendering = new THREE.Mesh(geometry, material);
        this.updateRendering();
        return this.rendering;
    }
}

class Tower {

    /**
     * The attack radius is given in terms of the number of grid tiles
     */
    constructor(atkRadius, cooldown, pos, team) {
        this.atkRadius = atkRadius;
        this.cdCap = cooldown;
        this.cooldown = cooldown;
        this.pos = pos.copy();
        this.team = team;
        this.color = Tile.teamColors[team];
    }

    update(bullets, newEntities) {
        if (this.cooldown == 0) {
            this.fire(new Vector2D(0, 0), bullets, newEntities);
            this.cooldown = this.cdCap;
        }
        this.cooldown--;
    }

    fire(target, bullets, newEntities) {
        var b = new Bullet(this.team, 0.05, this.pos.copy(), target.sub(this.pos));
        bullets.push(b);
        newEntities.push(b)
    }

    updateRendering() {
        if (this.rendering) {
            this.rendering.position.set(this.pos.x, 0.4, this.pos.y);
        }
    }

    initializeRendering() {
        var geometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        var material = new THREE.MeshBasicMaterial({color: this.color});
        var mesh = new THREE.Mesh(geometry, material);
        this.rendering = mesh;
        this.updateRendering();
        return this.rendering;
    }
}

module.exports = Tower;

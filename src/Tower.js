class Bullet {
    constructor(team, speed, pos, dirVector) {
        this.team = team;
        this.speed = speed;
        this.pos = pos;
        this.dirVector = dirVector;
        this.color = Tiles.teamColors[team];
    }

    update() {
        var angle = this.dirVector.direction();
        this.pos.x += this.speed * Math.cos(angle);
        this.pos.y += this.speed * Math.sin(angle);
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
        this.pos = pos;
        this.team = team;
        this.color = Tiles.teamColors[team];
    }

    update(bullets, newEntities) {
        if (this.cooldown == 0) {
            fire(new Vector2D(0, 0), bullets, newEntities);
            this.cooldown = this.cdCap;
        }
        this.cooldown--;
    }

    fire(target, bullets, newEntities) {
        var b = new Bullet(this.team, 0.05, this.pos, target.pos.sub(this.pos));
        bullets.push(b);
        newEntities.push(b)
    }

    updateRendering() {
        this.rendering.position.set(this.pos.x, 0.4, this.pos.y);
    }

    initializeRendering() {
        var geometry = new THREE.BoxGeometry(0.3, 1, 0.3);
        var material = new THREE.BasicMaterial(this.color);
        var mesh = new THREE.Mesh(geometry, material);
        this.rendering = mesh;
        this.updateRendering();
        return this.rendering;
    }
}

module.exports = Tower;

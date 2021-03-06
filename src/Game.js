const World = require('./World.js');
const Tower = require('./Tower');
const Dude = require('./Dude.js');
const Vector2D = require('./Vector2D.js');

const BASE_SPAWN_DELAY = 120;
class Game {
    
    constructor() {
        this.players = [];
        this.world = new World();
        this.spawnTimer = BASE_SPAWN_DELAY;
        this.dudes = [];
        this.bullets = [];
        this.towers = [];
        this.bullets = [];
        this.bases = this.world.getBases();

        this.towersSpawned = false;
    }

    spawnTowers(newEntities) {
        this.towers.push(new Tower(4, 10, new Vector2D(7, 0), 1));
        this.towers.push(new Tower(4, 10, new Vector2D(7, 4), 2));
        newEntities.push(this.towers[0]);
        newEntities.push(this.towers[1]);
    }

    spawnDudes(newEntities) {
        Object.entries(this.bases).forEach(
            ([team, base]) => {
                var team = base.team;
                var pos = base.pos.copy();
                var dude = new Dude(pos, team);
                this.dudes.push(dude);
                newEntities.push(dude);
            });
    }

    checkDudeCollisions(removing) {
        for (let dude of this.dudes) {
            var team = dude.team;
            var pos = dude.pos;
            for (let t in this.bases) {
                var base = this.bases[t];
                if (t != team && base.contains(dude.pos)) {
                    dude.hitBase(base, removing);
                    break;
                }
            }
        }
    }

    update() {
        var removingEntities = [];
        var newEntities = [];
        this.checkDudeCollisions(removingEntities);
        if (!this.towersSpawned) {
            this.spawnTowers(newEntities);
            this.towersSpawned = true;
        }
        if (this.spawnTimer === 0) {
            this.spawnDudes(newEntities);
            this.spawnTimer = BASE_SPAWN_DELAY;
        } else {
            this.spawnTimer--;
        }
        this.bullets.forEach(b => b.update());
        this.bullets.forEach(b => {
            if (!this.world.grid.isTileInBounds(b.pos)) {
                removingEntities.push(b);
            }
        });
        this.towers.forEach(t => t.update(this.bullets, newEntities));
        this.dudes.forEach(d => d.update());
        var rmfilter = e => !removingEntities.includes(e);
        this.towers = this.towers.filter(rmfilter);
        this.dudes = this.dudes.filter(rmfilter);
        this.bullets = this.bullets.filter(rmfilter);
        return { removed: removingEntities, added: newEntities };
    }

}

module.exports = Game;

const World = require('./World.js');
const Dude = require('./Dude.js');

const BASE_SPAWN_DELAY = 120;
class Game {
    
    constructor() {
        this.players = [];
        this.world = new World();
        this.spawnTimer = BASE_SPAWN_DELAY;
        this.dudes = [];
        this.bases = this.world.getBases();
    }

    spawnDudes(adding) {
        Object.entries(this.bases).forEach(
            ([team, base]) => {
                var team = base.team;
                var pos = base.pos;
                var dude = new Dude(pos, team);
                this.dudes.push(dude);
                adding.push(dude);
            });
    }

    checkDudeCollisions(removing) {
        for (let dude of this.dudes) {
            var team = dude.team;
            var pos = dude.pos;
            for (let base of this.bases) {
                if (base.team !== team && base.contains(dude.pos)) {
                    dude.hitBase(base, removing);
                    break;
                }
            }
        }
    }

    update() {
        var removingEntites = [];
        var newEntities = [];
        this.checkDudeCollisions(removingEntities);
        if (this.spawnTimer === 0) {
            this.spawnDudes(newEntities);
            this.spawnTimer = BASE_SPAWN_DELAY;
        } else {
            this.spawnTimer--;
        }
        this.dudes.forEach(d => d.update());
        return { removed: removingEntities, added: newEntites };
    }

}

module.exports = Game;

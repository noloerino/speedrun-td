const World = require('./World.js');
const Dude = require('./Dude.js');

const BASE_SPAWN_DELAY = 20;
class Game {
    
    constructor() {
        this.players = [];
        this.world = new World();
        this.spawnTimer = BASE_SPAWN_DELAY;
        this.dudes = [];
        this.bases = this.world.getBases();
    }

    spawnDudes() {
        Object.entries(this.bases).forEach(
            ([team, base]) => {
                var team = base.team;
                var pos = base.pos;
                var dude = new Dude(pos, team);
                this.dudes.push(dude);
            });
    }

    checkDudeCollisions(removing) {

    }

    update() {
        var removingDudes = [];
        this.checkDudeCollisions(removingDudes);
        if (this.spawnTimer == 0) {
            this.spawnDudes();
            this.spawnTimer = BASE_SPAWN_DELAY;
        } else {
            this.spawnTimer--;
        }
        this.dudes.forEach(d => d.update());
    }

}

module.exports = Game;

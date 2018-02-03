const World = require('./World.js');
const Dude = require('./Dude.js');

const BASE_SPAWN_DELAY = 20;
class Game {
	
	constructor() {
		this.players = [];
		this.world = new World();
        this.spawnTimer = BASE_SPAWN_DELAY;
        this.dudes = {};
        this.bases = this.world.getBases();
        for (let team in bases) {
        	this.dudes[team] = [];
        }
	}

	spawnDudes() {
		for (let base of bases) {
			var team = base.team;
			var pos = base.pos;
			var dude = new Dude()
			this.dudes[team].push(dude);
		}
	}

	update() {
		if (this.spawnTimer == 0) {
			spawnDudes();
			this.spawnTimer = BASE_SPAWN_DELAY;
		} else {
			this.spawnTimer--;
		}
		this.dudes.forEach(ds => ds.forEach(d => d.update()));
	}

}

module.exports = Game;

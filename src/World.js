const THREE = require('three');

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const BASE_SPAWN_DELAY = 20;
class Tile {

    constructor(name, color, passable, placeable) {
        this.name = name;
        this.color = color;
        this.passable = passable;
        this.placeable = placeable;
        this.team = -1; // signifies neutrality
        this.spawnTimer = -1; // only active if it's a base
    }

    isBase() {
        return this.name === Tile.FR_BASE_NAME;
    }

    update() {
        if (this.isBase()) {
            if (this.spawnTimer <= 0) {
                spawnDude();
                this.spawnTimer = BASE_SPAWN_DELAY;
            } else {
                this.spawnTimer -= 1;
            }
        }
    }

    static fromChar(c) {
        return Tile.tiles[c];
    }

    static makeBase(team) {
        var tile = new Tile(Tile.FR_BASE_NAME, Tile.teamColors[team], false, false);
        tile.team = team;
        tile.spawnTimer = BASE_SPAWN_DELAY;
        return tile;
    }
}

Object.defineProperty(Tile, "FR_BASE_NAME", {
    value: "base",
    writable: false,
});

Tile.tiles = {
    'o': new Tile("normal_tile", "green", true, true),
    '-': new Tile("empty_tile", "black", false, false),
    'p': new Tile("pathway", "yellow", true, false),
};
Tile.teamColors = {
    1: "blue",
    2: "red",
};

class Grid2D {

    /**
     * Initializes a grid
     *
     * `lines` is an array of strings, where each string describes a tile
     */
    constructor(lines) {
        // initialize a 2d array of tiles
        this.grid = [];
        // index of team and basecoords should match
        this.bases = [];
        this.teams = [];
        for (let line of lines) {
            var newArr = [];
            for (let c of line) {
                if (isNaN(c)) { // checks if is number
                    newArr.push(Tile.fromChar(c));
                } else {
                    var team = parseInt(c);
                    var base = Tile.makeBase(team);
                    this.teams.push(team);
                    this.bases.push(base);
                    newArr.push(base);
                }
            }
            this.grid.push(newArr);
        }
    }

    getTileAt(pos) {
        if(isTileInBounds(pos)) {
            return this.grid[pos.y][pos.x];
        } else {
            throw new Error(`Could not find tile at (${pos.x}, ${pos.y})`);
        }
    }

    isTileInBounds(pos) {
        if (pos.y >= this.grid.length) {
            return false;
        }
        var row = this.grid[pos.y];
        return pos.x < row.length;
    }

    isTilePassable(pos) {
        return isTileInBounds(pos) && getTileAt(pos).passable;
    }
}

class Tower {

    /**
     * The attack radius is given in terms of the number of grid tiles
     */
    constructor(atkRadius, cooldown, pos) {
        this.atkRadius = atkRadius;
        this.cooldown = cooldown;
        this.pos = pos;
    }
}

class Dude {

    /**
     * `speed` is a final property, given in terms of distance moved per update cycle
     * (should be fine-tuned)
     * `pos` is transient, and is the location of the dude relative to the coordinate grid.
     */
    constructor(speed, pos, team) {
        this.speed = speed;
        this.pos = pos;
    }
}

class Bullet {
    constructor(speed, pos) {
        
    }
}

const TEST_MAP = ["-----o----ooo",
"ooo--o----ooo",
"1ppppppppppp2",
"ooo--o----ooo",
"ooo--o-------"];

class World {

    constructor() {
        this.tiles = new Grid2D(TEST_MAP);
        this.dudes = [];
    }

    initializeRendering() {
        var group = new THREE.Group();
        var geometry = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshBasicMaterial({color: 0xff0000})
        this.tiles.getTiles().map(tile => {
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(tile.getPos().x, tile.getPos().y, 0)
            group.add(cube);
        })
        return group;
    }

    getTiles() {
        return this.tiles;
    }

    getDudes() {
        return this.dudes;
    }

    addDude(v) {

    }

    getTowers() {

    }

    addTower(v) {

    }

    getBullets() {

    }

    spawnEnemy() {

    }

    removeTower(id) {

    }
}

module.exports = World;

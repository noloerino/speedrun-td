const THREE = require('three');

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }
}

const BASE_SPAWN_DELAY = 20;
const FR_BASE_NAME = "base";
const EMPTY_NAME = "empty_tile";
class Tile {

    constructor(name, color, passable, placeable) {
        this.name = name;
        this.color = color;
        this.passable = passable;
        this.placeable = placeable;
        this.team = -1; // signifies neutrality
        this.spawnTimer = -1; // only active if it's a base
    }

    setPos(pos) {
        this.pos = pos;
    }

    getPos() {
        return this.pos;
    }

    isBase() {
        return this.name === FR_BASE_NAME;
    }

    isEmpty() {
        return this.name === EMPTY_NAME;
    }

    spawnDude() {
        if (this.isBase()) {
            console.log("I should spawn a dude somehow");
        }
    }

    update() {
        if (this.isBase()) {
            if (this.spawnTimer <= 0) {
                spawnDude();
                this.spawnTimer = BASE_SPAWN_DELAY;
            } else {
                this.spawnTimer--;
            }
        }
    }

    static fromChar(c) {
        return Tile.tiles[c]();
    }

    static makeBase(team) {
        var tile = new Tile(FR_BASE_NAME, Tile.teamColors[team], false, false);
        tile.team = team;
        tile.spawnTimer = BASE_SPAWN_DELAY;
        return tile;
    }
}

Tile.tiles = {
    'o': () => new Tile("normal_tile", 0x42f44b, true, true),
    '-': () => new Tile(EMPTY_NAME, 0x000000, false, false),
    'p': () => new Tile("pathway", 0xd9f441, true, false),
};
Tile.teamColors = {
    1: 0x41c4f4,
    2: 0xf44341,
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
        // map of team id to base object
        this.bases = {};
        var y = 0;
        for (let line of lines) {
            var newArr = [];
            var x = 0;
            for (let c of line) {
                if (isNaN(c)) { // checks if is number
                    var tile = Tile.fromChar(c);
                    tile.setPos(new Vector2D(x, y));
                    newArr.push(tile);
                } else {
                    var team = parseInt(c);
                    var base = Tile.makeBase(team);
                    base.setPos(new Vector2D(x ,y));
                    this.bases[team] = base;
                    newArr.push(base);
                }
                x++;
            }
            this.grid.push(newArr);
            y++;
        }
    }

    getWidth() {
        var wide = 0;
        for (let row of this.grid) {
            if (row.length > wide) {
                wide = row.length;
            }
        }
        return wide;
    }

    getLength() {
        return this.grid.length;
    }

    getTiles() {
        return [].concat.apply([], this.grid);
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
        switch (dir) {
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

class Bullet {
    constructor(speed, pos) {
        
    }
}

const TEST_MAP = ["------o----ooo",
"ooo---o----ooo",
"1pppppppppppp2",
"ooo---o----ooo",
"ooo---o-------"];

class World {

    constructor() {
        this.grid = new Grid2D(TEST_MAP);
        this.dudes = [];
    }

    initializeRendering() {
        var group = new THREE.Group();
        this.getTiles().map(tile => {
            if (tile.isEmpty()) {
                return;
            }
            var material = new THREE.MeshStandardMaterial({color: tile.color});
            var geometry = new THREE.BoxGeometry(1, 0.4, 1);
            var cube = new THREE.Mesh(geometry, material);
            cube.position.set(tile.getPos().x, 0, tile.getPos().y);
            group.add(cube);
        })
        return group;
    }

    getTiles() {
        return this.grid.getTiles();
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

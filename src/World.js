const THREE = require('three');

const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";

class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(o) {
        return new Vector2D(this.x - o.x, this.y - o.y);
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }
}

const FR_BASE_NAME = "base";
const EMPTY_NAME = "empty_tile";
class Tile {

    constructor(name, color, passable, placeable) {
        this.name = name;
        this.color = color;
        this.passable = passable;
        this.placeable = placeable;
        this.team = -1; // signifies neutrality
    }

    setPos(pos) {
        this.pos = pos;
    }

    getPos() {
        return this.pos;
    }

    contains(pos) {
        var xdiff = pos.x - this.pos.x;
        var ydiff = pos.y - this.pos.y;
        return Math.sqrt(xdiff * xdiff + ydiff * ydiff) < 1;
    }

    getSpawnDir() {
        if (this.isBase()) {
            return Tile.teamDirs[this.team];
        } else {
            throw new Error("Cannot get spawn direction of non-base tile");
        }
    }

    isBase() {
        return this.name === FR_BASE_NAME;
    }

    isEmpty() {
        return this.name === EMPTY_NAME;
    }

    static fromChar(c) {
        return Tile.tiles[c]();
    }

    static makeBase(team) {
        var tile = new Tile(FR_BASE_NAME, Tile.teamColors[team], false, false);
        tile.team = team;
        tile.hp = 100;
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
Tile.teamDirs = {
    1: RIGHT,
    2: LEFT,
}

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
    constructor(atkRadius, cooldown, pos, team) {
        this.atkRadius = atkRadius;
        this.cdCap = cooldown;
        this.cooldown = cooldown;
        this.pos = pos;
        this.team = team;
    }

    fire(target, newBullets, newEntities) {
        var b = new Bullet(this.team, 0.05, this.pos, );
        newBullets.push(b);
        newEntities.push(b)
    }
}

class Bullet {
    constructor(team, speed, pos, dirVector) {
        
    }
}

const TEST_MAP = ["-------o----ooo",
"ooo----o----ooo",
"1ppppppppppppp2",
"ooo----o----ooo",
"ooo----o-------"];

class World {

    constructor() {
        this.grid = new Grid2D(TEST_MAP);
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

    getBases() {
        return this.grid.bases;
    }
}

module.exports = World;

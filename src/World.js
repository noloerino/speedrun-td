const THREE = require('three');
const Vector2D = require('./Vector2D.js');
const Tile = require('./Tile');
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
        return 0 < pos.x && pos.x < this.getWidth() && 0 < pos.y && pos.y < this.getLength();
    }

    isTilePassable(pos) {
        return isTileInBounds(pos) && getTileAt(pos).passable;
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

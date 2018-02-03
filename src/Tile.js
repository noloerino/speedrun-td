
const UP = "up";
const DOWN = "down";
const LEFT = "left";
const RIGHT = "right";

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

module.exports = Tile;

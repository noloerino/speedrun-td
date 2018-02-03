class Vector2D {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    sub(o) {
        return new Vector2D(this.x - o.x, this.y - o.y);
    }

    direction() {
        return Math.atan2(this.y, this.x);
    }

    copy() {
        return new Vector2D(this.x, this.y);
    }
}

module.exports = Vector2D;
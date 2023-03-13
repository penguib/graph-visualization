function generateUniqSerial() {
    return 'xxxx-xxxx-xxx-xxxx'.replace(/[x]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    });
}

class Pivot {
    constructor(x, y) {
        this.x = x;
        this.y = y;
        this.start = false;
        this.end = false;
        this.value = Infinity;
        this.visited = false;
        this.uuid = generateUniqSerial();
        this.index = null;
    }
}

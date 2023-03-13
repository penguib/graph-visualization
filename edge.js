class Edge {
    // pivot points
    constructor(a, b) {
        this.a = a;
        this.b = b;
        this.weight = this.calculateWeight();   
        this.color = "#ffffff";
    }

    setColor(color) {
        this.color = color;
    }

    calculateWeight() {
        return Math.sqrt(Math.pow(this.a.x - this.b.x, 2) + Math.pow(this.a.y - this.b.y, 2));
    }
}

class Graph {
    constructor(color) {
        this.edges = [];
        this.pivots = []; 
        this.radius = 30;
        this.color = color;
    }

    _getNodeColor(node) {
        if (node.src)
            return "#00ff00"
        if (node.target)
            return "#ff0000"

        return null;
    }

    draw() {
        for (let edge of this.edges) {
            stroke(edge.color)
            strokeWeight(2)
            line(edge.a.x, edge.a.y, edge.b.x, edge.b.y);
            
            noStroke();

            let aColor = this._getNodeColor(edge.a);
            fill((aColor) ? aColor : this.color)
            ellipse(edge.a.x, edge.a.y, this.radius, this.radius);

            if (edge.a.index != null) {
                fill("#000000")
                text(edge.a.index, edge.a.x, edge.a.y)
            }

            let bColor = this._getNodeColor(edge.b);
            fill((bColor) ? bColor : this.color)
            ellipse(edge.b.x, edge.b.y, this.radius, this.radius);

            if (edge.b.index != null) {
                fill("#000000")
                text(edge.b.index, edge.b.x, edge.b.y)
            }
        }
    }

    addEdge(edge) {
        this.edges.push(edge);
    }

    addPivot(pivot) {
        this.pivots.push(pivot);
    }

    getPivot(uuid) {
        return this.pivots.find(x => x.uuid === uuid)
    }

    getTargetPivot() {
        return this.pivots.find(x => x.target)
    }

    getEdge(i, j) {
        return this.edges.find(x => (x.a.uuid === i || x.b.uuid === i) && (x.a.uuid === j || x.b.uuid === j))
    }

    clear() {
        this.edges = [];
        this.pivots = [];
    }

    // Dijkstra's
    findShortestPath() {
        let prev = {};
        let dist = {};
        let Q = []
        let src = combinedGraph.pivots.find(x => x.src)

        let index = 0;
        for (let vertex of combinedGraph.pivots) {
            vertex.index = index;
            dist[vertex.uuid] = Infinity;
            prev[vertex.uuid] = null;
            Q.push(vertex);
            index++;
        }
        dist[src.uuid] = 0;

        while (Q.length > 0) {
            // Make a new array with all the distances that are in Q to pick from
            let availVerts = Object.keys(dist).filter(a => Q.includes(combinedGraph.getPivot(a)))
            let possibleDist = [];
            for (let uuid of availVerts) {
                possibleDist.push(dist[uuid]);
            }

            // Find the vert with the smallest distance and return its UUID
            let u = Q.map(a => a.uuid).find(x => dist[x] === Math.min(...possibleDist));
            let vertIndex = Q.indexOf(Q.find(x => x.uuid === u));
            Q.splice(vertIndex, 1)

            let edges = combinedGraph.edges.filter(x => x.a.uuid == u || x.b.uuid == u);

            for (let e of edges) {
                let n = (e.a.uuid === u) ? e.b : e.a;
                if (!Q.includes(n))
                    continue;
                let alt = dist[u] + e.weight;
                if (alt < dist[n.uuid]) {
                    dist[n.uuid] = alt;
                    prev[n.uuid] = u;
                }
            }
        }

        return { dist, prev };
    }
}

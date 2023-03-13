class Graph {
    constructor(edges = [], pivots = [], color) {
        this.edges = edges;
        this.pivots = pivots
        this.radius = 30;
        this.color = color;
    }

    draw() {
        for (let edge of this.edges) {
            stroke(1);
            //strokeWeight(edge.weight / 25);
            line(edge.a.x, edge.a.y, edge.b.x, edge.b.y);

            if (edge.a.start)
                fill(`#00ff00`);
            else if (edge.a.end)
                fill("#ff0000");
            else
                fill(`rgba(${this.color.r},${this.color.g},${this.color.b},1)`);
            ellipse(edge.a.x, edge.a.y, this.radius, this.radius);

            if (edge.a.index != null) {
                fill("#000000")
                text(edge.a.index, edge.a.x, edge.a.y)
            }

            if (edge.b.start)
                fill(`#00ff00`);
            else if (edge.b.end)
                fill("#ff0000");
            else
                fill(`rgba(${this.color.r},${this.color.g},${this.color.b},1)`);

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

    getStartPivot() {
        return this.pivots[0]
    }

    getTargetPivot() {
        return this.pivots.find(x => x.end)
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
        let src = combinedGraph.pivots.find(x => x.start)

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

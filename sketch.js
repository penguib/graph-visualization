const shortcutGraph = new Graph([], [], {r: 255, g: 0, b: 0});
const routeGraph = new Graph([], [], {r: 0, g: 0, b: 128});
let combinedGraph = new Graph([], [], {r: 255, g: 255, b: 128});

let startNode = null;
let endNode = null;

const nodeRadius = 10;
let singleNode = null;
let clickedPivot = null;
let drawMode = 0;
let cgraphs = 0;

function setup() {
    createCanvas(600, 600);
}

function draw() {
    background(220);
    if (cgraphs === 0) {
        shortcutGraph.draw();
        routeGraph.draw();
    } else {
        combinedGraph.draw();
    }
}

function withinEllipse(x1, y1, x2, y2, r) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)) < r
}

// For now lets combine each node to each other
function combineGraphs() {
    combinedGraph.edges.push(...routeGraph.edges);
    combinedGraph.edges.push(...shortcutGraph.edges);
    routeGraph.pivots[0].start = true;
    routeGraph.pivots[routeGraph.pivots.length - 1].end = true;
    combinedGraph.pivots = [...routeGraph.pivots, ...shortcutGraph.pivots]

    for (let rpivot of routeGraph.pivots) {
        for (let spivot of shortcutGraph.pivots) {
            combinedGraph.addEdge(new Edge(spivot, rpivot));
        }
    }
    // console.log(combinedGraph.edges)
}

function print_array(arr) {
    for (let a of arr) {
        console.log(a.uuid)
    }
    console.log("--------")
}

function findShortestPath() {
    cgraphs = 1;
    combineGraphs();

    return combinedGraph.findShortestPath();
}

function extractShortestPath(prev) {
    let target = combinedGraph.getTargetPivot();
    let path = [];
    let curPivot = target.uuid;
    while (prev[curPivot] != null) {
        path.push(curPivot);
        curPivot = prev[curPivot];
    }
    path.push(curPivot)
    return path.reverse();
}

function keyPressed() {
    switch (keyCode) {
        case LEFT_ARROW:
            {
                drawMode = 0;
                return;
            }
        case RIGHT_ARROW:
            {
                drawMode = 1;
                return;
            }
        case ENTER:
            {
                let path = findShortestPath();
                console.log(path.prev)
                console.log(extractShortestPath(path.prev))
                return;
            }
        default:
            return;
    }
}

function mouseClicked() {
    // Create a local pivot from our mouse click
    const localPivot = new Pivot(mouseX, mouseY);
    let localGraph = (drawMode === 0) ? shortcutGraph : routeGraph;
    // Let's look if we clicked a pivot to connect to
    const localClickedPivot = localGraph.pivots.find(p => withinEllipse(mouseX, mouseY, p.x, p.y, localGraph.radius));

    // If we already clicked a pivot on the screen
    if (clickedPivot != null) {
        // We found one
        if (localClickedPivot) {
            // Connect the two pivots with an edge and add to graph
            localGraph.addEdge(new Edge(clickedPivot, localClickedPivot));

            // Reset both nodes
            singleNode = null;
            clickedPivot = null;
            return false;
        }

        // We have a clicked pivot and want to connect to a new pivot
        localGraph.addEdge(new Edge(clickedPivot, localPivot));
        localGraph.addPivot(localPivot);
        singleNode = null;
        clickedPivot = null;
        return false;
    }

    if (localClickedPivot) {
        // bug cant click new pivot and connect to existing
        clickedPivot = localClickedPivot;
        return false;
    }

    // Now we can add the pivot since we know we are adding a new pivot
    localGraph.addPivot(localPivot);

    // If we already tried placing a node then connect it
    if (singleNode != null) {
        // If we clicked on a pivot, connect the ghost node to the pivot
        if (localClickedPivot) {
            localGraph.addEdge(new Edge(singleNode, localClickedPivot))
            singleNode = null;
            return false;
        }

        // Otherwise, connect 
        localGraph.addEdge(new Edge(singleNode, localPivot));
        singleNode = null;
        return false;
    }

    clickedPivot = localClickedPivot;
    singleNode = localPivot;
    return false; 
}

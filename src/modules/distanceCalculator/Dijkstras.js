/**
 * Javascript implementation of Dijkstra's algorithm
 * Based on: http://en.wikipedia.org/wiki/Dijkstra's_algorithm
 * Author: James Jackson (www.jamesdavidjackson.com)
 * Source: http://github.com/nojacko/dijkstras-js/tree/
 *
 * Useage:
 *	var d = new Dijkstras();
 *	d.setGraph(
 *		[
 *			['A', [['B', 20], ['C', 20]] ],
 *			['B', [['A', 30], ['C', 100]] ],
 *			['C', [['D', 10], ['A', 20]] ],
 *			['D', [['C', 10], ['B', 20]] ]
 *		]
 *	);
 *	var path = d.getPath('A', 'D');
 *
 */

/**
 * @class Dijkstras
 **/
class Dijkstras {

    constructor() {
        this.graph = [];
        this.queue;
        this.distance = [];
        this.previous = []
    }

    /**
     * Creates a graph from array.
     * Each element in the array should be in the format:
     *    [NODE NAME, [[NODE NAME, COST], ...] ]
     *
     * For example:    [
     *        ['A', [['B', 20], ['C', 20]] ],
     *        ['B', [['A', 30], ['C', 100]] ],
     *        ['C', [['D', 10], ['A', 20]] ],
     *        ['D', [['C', 10], ['B', 20]] ]
     *    ]
     *
     * @param graph Array of nodes and vertices.
     **/
    setGraph(graph) {
        // Error check graph
        if (typeof graph !== 'object') {
            throw "graph isn't an object (" + typeof graph + ")";
        }

        if (graph.length < 1) {
            throw "graph is empty";
        }

        for (let index in graph) {
            // Error check each node
            let node = graph[index];
            if (typeof node !== 'object' || node.length !== 2) {
                throw "node must be an array and contain 2 values (name, vertices). Failed at index: " + index;
            }

            let nodeName = node[0];
            let vertices = node[1];
            this.graph[nodeName] = [];

            for (let v in vertices) {
                // Error check each node
                let vertex = vertices[v];
                if (typeof vertex !== 'object' || vertex.length !== 2) {
                    throw "vertex must be an array and contain 2 values (name, vertices). Failed at index: " + index + "[" + v + "]";
                }
                let vertexName = vertex[0];
                this.graph[nodeName][vertexName] = vertex[1];
            }
        }
    }

    /**
     * Find shortest path
     *
     * @param source The starting node.
     * @param target The target node.
     * @return array Path to target, or empty array if unable to find path.
     */
    getPath(source, target) {
        // Check source and target exist
        if (typeof this.graph[source] === 'undefined') {
            throw "source " + source + " doesn't exist";
        }
        if (typeof this.graph[target] === 'undefined') {
            throw "target " + target + " doesn't exist";
        }

        // Already at target
        if (source === target) {
            return [];
        }

        // Reset all previous values
        this.queue = new MinHeap();
        this.queue.add(source, 0);
        this.previous[source] = null;

        // Loop all nodes
        let u = null;
        while (u = this.queue.shift()) {
            // Reached taget!
            if (u === target) {
                let path = [];
                while (this.previous[u] !== null) {
                    path.unshift(u);
                    u = this.previous[u];
                }
                return path;
            }

            // all remaining vertices are inaccessible from source
            if (this.queue.getDistance(u) === Infinity) {
                return [];
            }

            let uDistance = this.queue.getDistance(u);
            for (let neighbour in this.graph[u]) {
                let nDistance = this.queue.getDistance(neighbour),
                    aDistance = uDistance + this.graph[u][neighbour];

                if (aDistance < nDistance) {
                    this.queue.update(neighbour, aDistance);
                    this.previous[neighbour] = u;
                }
            }
        }

        return [];
    }
}


// Fibonacci Heap (min first)
class MinHeap {
    constructor() {
        this.min = null;
        this.roots = [];
        this.nodes = [];
    }

    shift() {
        let minNode = this.min;

        // Current min is null or no more after it
        if (minNode === null || this.roots.length < 1) {
            this.min = null;
            return minNode
        }

        // Remove it
        this.remove(minNode);

        // Consolidate
        if (this.roots.length > 50) {
            this.consolidate();
        }

        // Get next min
        let lowestDistance = Infinity,
            length = this.roots.length;

        for (let i = 0; i < length; i++) {
            let node = this.roots[i],
                distance = this.getDistance(node);

            if (distance < lowestDistance) {
                lowestDistance = distance;
                this.min = node;
            }
        }

        return minNode;
    }

    consolidate() {
        // Consolidate
        let depths = [[], [], [], [], [], [], []],
            maxDepth = depths.length - 1, // 0-index
            removeFromRoots = [];

        // Populate depths array
        let length = this.roots.length;
        for (let i = 0; i < length; i++) {
            let node = this.roots[i],
                depth = this.nodes[node].depth;

            if (depth < maxDepth) {
                depths[depth].push(node);
            }
        }

        // Consolidate
        for (let depth = 0; depth <= maxDepth; depth++) {
            while (depths[depth].length > 1) {

                let first = depths[depth].shift(),
                    second = depths[depth].shift(),
                    newDepth = depth + 1,
                    pos = -1;

                if (this.nodes[first].distance < this.nodes[second].distance) {
                    this.nodes[first].depth = newDepth;
                    this.nodes[first].children.push(second);
                    this.nodes[second].parent = first;

                    if (newDepth <= maxDepth) {
                        depths[newDepth].push(first);
                    }

                    // Find position in roots where adopted node is
                    pos = this.roots.indexOf(second);

                } else {
                    this.nodes[second].depth = newDepth;
                    this.nodes[second].children.push(first);
                    this.nodes[first].parent = second;

                    if (newDepth <= maxDepth) {
                        depths[newDepth].push(second);
                    }

                    // Find position in roots where adopted node is
                    pos = this.roots.indexOf(first);
                }

                // Remove roots that have been made children
                if (pos > -1) {
                    this.roots.splice(pos, 1);
                }
            }
        }
    }

    add(node, distance) {
        // Add the node
        this.nodes[node] = {
            node: node,
            distance: distance,
            depth: 0,
            parent: null,
            children: []
        };

        // Is it the minimum?
        if (!this.min || distance < this.nodes[this.min].distance) {
            this.min = node;
        }

        // Other stuff
        this.roots.push(node);
    }

    update(node, distance) {
        this.remove(node);
        this.add(node, distance);
    }

    remove(node) {
        if (!this.nodes[node]) {
            return;
        }

        // Move children to be children of the parent
        let numChildren = this.nodes[node].children.length;
        if (numChildren > 0) {
            for (let i = 0; i < numChildren; i++) {
                let child = this.nodes[node].children[i];
                this.nodes[child].parent = this.nodes[node].parent;

                // No parent, then add to roots
                if (this.nodes[child].parent === null) {
                    this.roots.push(child);
                }
            }
        }

        let parent = this.nodes[node].parent;

        // Root, so remove from roots
        if (parent === null) {
            let pos = this.roots.indexOf(node);
            if (pos > -1) {
                this.roots.splice(pos, 1);
            }
        } else {
            // Go up the parents and decrease their depth
            while (parent) {
                this.nodes[parent].depth--;
                parent = this.nodes[parent].parent
            }
        }
    }

    getDistance(node) {
        if (this.nodes[node]) {
            return this.nodes[node].distance;
        }
        return Infinity;
    }
}

module.exports = Dijkstras;
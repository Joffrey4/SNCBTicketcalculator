"use strict";

/**
 *
 * "Dijkstra's algorithm, conceived by Dutch computer scientist Edsger Dijkstra,
 * is a graph search algorithm that solves the single-source shortest path problem
 * for a graph with nonnegative edge path costs, producing a shortest path tree.
 * This algorithm is often used in routing and as a subroutine in other graph algorithms."
 *
 * var map = {a:{b:3,c:1},b:{a:2,c:1},c:{a:4,b:1}},
 * graph = new Graph(map);
 *
 * graph.findShortestPath('a', 'b');      // => ['a', 'c', 'b']
 * graph.findShortestPath('a', 'c');      // => ['a', 'c']
 * graph.findShortestPath('b', 'a');      // => ['b', 'a']
 * graph.findShortestPath('b', 'c', 'b'); // => ['b', 'c', 'b']
 * graph.findShortestPath('c', 'a', 'b'); // => ['c', 'b', 'a', 'c', 'b']
 * graph.findShortestPath('c', 'b', 'a'); // => ['c', 'b', 'a']
 *
 */

let Dijkstra = (function (undefined) {

    let extractKeys = function (obj) {
        let keys = [], key;
        for (key in obj) {
            Object.prototype.hasOwnProperty.call(obj,key) && keys.push(key);
        }
        return keys;
    };

    let sorter = function (a, b) {
        return parseFloat (a) - parseFloat (b);
    };

    let findPaths = function (map, start, end, infinity) {
        infinity = infinity || Infinity;

        let costs = {},
            open = {'0': [start]},
            predecessors = {},
            keys;

        let addToOpen = function (cost, vertex) {
            let key = "" + cost;
            if (!open[key]) open[key] = [];
            open[key].push(vertex);
        };

        costs[start] = 0;

        while (open) {
            if(!(keys = extractKeys(open)).length) break;

            keys.sort(sorter);

            let key = keys[0],
                bucket = open[key],
                node = bucket.shift(),
                currentCost = parseFloat(key),
                adjacentNodes = map[node] || {};

            if (!bucket.length) delete open[key];

            for (let vertex in adjacentNodes) {
                if (Object.prototype.hasOwnProperty.call(adjacentNodes, vertex)) {
                    let cost = adjacentNodes[vertex],
                        totalCost = cost + currentCost,
                        vertexCost = costs[vertex];

                    if ((vertexCost === undefined) || (vertexCost > totalCost)) {
                        costs[vertex] = totalCost;
                        addToOpen(totalCost, vertex);
                        predecessors[vertex] = node;
                    }
                }
            }
        }

        if (costs[end] === undefined) {
            return null;
        } else {
            return predecessors;
        }

    };

    let extractShortest = function (predecessors, end) {
        let nodes = [],
            u = end;

        while (u !== undefined) {
            nodes.push(u);
            u = predecessors[u];
        }

        nodes.reverse();
        return nodes;
    };

    let findShortestPath = function (map, nodes) {
        let start = nodes.shift(),
            end,
            predecessors,
            path = [],
            shortest;

        while (nodes.length) {
            end = nodes.shift();
            predecessors = findPaths(map, start, end);

            if (predecessors) {
                shortest = extractShortest(predecessors, end);
                if (nodes.length) {
                    path.push.apply(path, shortest.slice(0, -1));
                } else {
                    return path.concat(shortest);
                }
            } else {
                return null;
            }

            start = end;
        }
    };

    let toArray = function (list, offset) {
        try {
            return Array.prototype.slice.call(list, offset);
        } catch (e) {
            let a = [];
            for (let i = offset || 0, l = list.length; i < l; ++i) {
                a.push(list[i]);
            }
            return a;
        }
    };

    let Graph = function (map) {
        this.map = map;
    };

    Graph.prototype.findShortestPath = function (start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(this.map, start);
        } else if (arguments.length === 2) {
            return findShortestPath(this.map, [start, end]);
        } else {
            return findShortestPath(this.map, toArray(arguments));
        }
    };

    Graph.findShortestPath = function (map, start, end) {
        if (Object.prototype.toString.call(start) === '[object Array]') {
            return findShortestPath(map, start);
        } else if (arguments.length === 3) {
            return findShortestPath(map, [start, end]);
        } else {
            return findShortestPath(map, toArray(arguments, 1));
        }
    };

    return Graph;

})();

module.exports = Dijkstra;
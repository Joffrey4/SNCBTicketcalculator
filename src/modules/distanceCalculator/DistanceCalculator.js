"use strict";

const JSON_GRAPH = require('../../registers/stationDistances.json');
let Dijkstra = require('./Dijkstras');
let graph = new Dijkstra(JSON_GRAPH);

class DistanceCalculator {

    constructor(origin, destination) {
        this.origin = origin;
        this.destination = destination;
    }

    static zoneChecker(path) {
        /*
        The travel passing by some areas is longer than a travel to or from this area.
        This function add the amount of missing kilometer to the travel that pass by one
        of those areas.
         */
        if (path.includes("antwerpen-berchem")) {
            return 1
        } else {
            return 0
        }
    }

    get distance() {
        let path = graph.findShortestPath(this.origin, this.destination);
        path.shift();

        //console.log(path);

        let origin = this.origin;
        let distance = 0;
        distance += DistanceCalculator.zoneChecker(path);

        path.forEach((station) => {
            distance += JSON_GRAPH[origin][station];
            origin = station;
        });

        return distance;
    }
}

module.exports = DistanceCalculator;
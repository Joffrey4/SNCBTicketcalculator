const ARRAY_GRAPH = require('../../registers/stationDistancesArray.json');
const JSON_GRAPH = require('../../registers/stationDistances.json');
let Dijkstras = require('./Dijkstras');

// Graph initialization
let d = new Dijkstras();
d.setGraph(ARRAY_GRAPH);

class DistanceCalculator {

    constructor(origin, destination) {
        this.origin = origin;
        this.destination = destination;
    }

    get distance() {
        let path = d.getPath(this.origin, this.destination);
        console.log(path);

        let origin = this.origin;
        let distance;

        console.log(JSON_GRAPH[origin]);

        for (let station in path) {
            distance += JSON_GRAPH[origin][station];
            origin = station;
        }

        return distance;
    }
}

module.exports = DistanceCalculator;
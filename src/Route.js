"use strict";

let DistanceCalculator = require('./modules/distanceCalculator/DistanceCalculator');

class Route {

    constructor(origin, destination) {
        this.origin = origin;
        this.destination = destination;

        this.init()
    }

    /**
     * Math the distance between the origin and the destination's stations.
     * @returns {DistanceCalculator} int - The distance, in kilometers.
     */
    init() {
        let calculator = new DistanceCalculator(this.origin, this.destination);
        this.distance = calculator.distance;
    }
}

module.exports = Route;
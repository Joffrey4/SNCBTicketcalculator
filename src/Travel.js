"use strict";

let Ticket = require('./Ticket');
let Route = require('./Route');
let Passenger = require('./Passenger');

class Travel {

    constructor(origin, destination, date, passengers) {
        this.origin = origin;
        this.destination = destination;
        this.date = date;
        this.passengers = passengers;

        this.init()
    }

    init() {
        this.distance = this.mathDistance();
        this.passengers = this.setPassengers();
        this.combinations = this.retrieveConbinations()
    }

    mathDistance() {
        let route = new Route(this.origin, this.destination);
        return route.distance;
    }

    setPassengers() {
        let passengers = [];
        this.passengers.forEach((passenger) => {
            passengers.push(new Passenger(passenger["age"], passenger["promotion"]))
        });
        return passengers
    }

    retrieveConbinations() {

    }

    isWeekend() {
        return this.date.getDay() === 6 || this.date.getDay() === 0;
    }
}
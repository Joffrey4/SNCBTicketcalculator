"use strict";

const PRICES = require('./registers/ticketPrices.json');

class Ticket {

    /**
     * Ticket object. Used to math the price.
     * @param type String, the type of the ticket. Ex: "normal", "senior", "animal", ...
     * @param promotion Int, the id of a promotion. 0 = no promotion, 1 = 50%, 2 = 70%, 3 = 75%.
     * @param clazs String, the class of the ticket. Must be "1" or "2".
     * @param roundtrip Boolean, set to true if the ticket is a roundtrip.
     * @param distance Int, the distance in kilometer between the origin & destination.
     * @param origin String, the origin station.
     * @param destination String, the destination station.
     */
    constructor(type, promotion, clazs, roundtrip, distance, origin, destination) {
        this.type = type;
        this.promotion = promotion;
        this.clazs = clazs;
        this.roundtrip = roundtrip;
        this.distance = distance;
        this.origin = origin;
        this.destination = destination;

        this.init()
    }

    init() {
        switch (this.type) {
            case "senior":
                this.price = this.mathSeniorPrice();
                break;

            case "gopass1":
                this.price = this.mathGopassPrice();
                break;

            case "normal":
                this.price = this.mathNormalPrice();
                break;

            default:
                this.price = this.mathUniquePrice();
        }
    }

    mathNormalPrice() {
        return this.roundTripPrice(PRICES[this.type][this.clazs][this.getPriceDistance()][this.promotion]);
    }

    mathSeniorPrice() {
        return PRICES[this.type][this.clazs]
    }

    mathGopassPrice() {
        return this.roundTripPrice(PRICES[this.type])
    }

    mathUniquePrice() {
        return PRICES[this.type]
    }

    /**
     * Multiply the price of the ticket by two if it's a roundtrip.
     * @param price Int, the single-way price of the ticket.
     * @returns number Int, the roundtrip price id the ticket is a roundtrip.
     */
    roundTripPrice(price) {
        if (this.roundtrip === true) {
            return price * 2
        } else {
            return price
        }
    }

    /**
     * Return the nearest lower distance in the PRICES array, from the distance in KM.
     * @returns distance Int, the distance in kilometer.
     */
    getPriceDistance() {
        let distance = this.distance;
        while (PRICES[this.type][this.clazs][distance] === undefined) {
            distance -= 1;
        }
        return distance;
    }
}

module.exports = Ticket;
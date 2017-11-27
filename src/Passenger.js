"use strict";

class Passenger {
    
    constructor(age, promotion) {
        this.age = age;
        this.promotion = promotion;

        this.init();
    }

    init() {
        this.tickets = []
    }
}

module.exports = Passenger;
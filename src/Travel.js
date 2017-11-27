"use strict";

let Ticket = require('./Ticket');
let Route = require('./Route');
let Passenger = require('./Passenger');

class Travel {

    /**
     * Return a set of ticket's conbinations for one travel, at one day, for one or more people.
     * @param origin
     * @param destination
     * @param date
     * @param clazs
     * @param roundtrip
     * @param passengers
     */
    constructor(origin, destination, date, clazs, roundtrip, passengers) {
        this.origin = origin;
        this.destination = destination;
        this.date = date;
        this.clazs = clazs;
        this.roundtrip = roundtrip;
        this.passengers = passengers;

        this.init()
    }

    init() {
        this.distance = this.mathDistance();
        this.passengers = this.setPassengers();
        this.combinations = this.retrieveCombinations()
    }

    mathDistance() {
        let route = new Route(this.origin, this.destination);
        return route.distance;
    }

    setPassengers() {
        let passengers = [];
        this.passengers.forEach((passenger) => {
            passengers.push(new Passenger(passenger[0], passenger[1]))
        });
        return passengers
    }

    /**
     * Create combinations of the tickets of all passengers, and math the total price of each combination.
     * Return an array of combinations, with in each one, the total price and each ticket.
     * Like: [ [35, [ticket1, ticket2, ticket3]],
     *         [40, [ticket1, ticket2, ticket3]] ]
     */
    retrieveCombinations() {
        this.createAllTickets();
        return this.retrieveCombinationsRecursive(0, this.passengers.length, [])

    }

    retrieveCombinationsRecursive(currentPassenger, passengersAmount, combinations) {

        // Return the combinations if all passenger were checked.
        if (currentPassenger === passengersAmount) {
            return combinations

        } else {
            // Print directly in the combinations array if it's the first iteration.
            if (combinations.length === 0) {
                this.passengers[currentPassenger].tickets.forEach((ticket) => {
                    combinations.push([ticket.price, [ticket]]);
                });
            } else {
            // Add the tickets of the next passenger to the existing
                let newCombinations = [];
                this.passengers[currentPassenger].tickets.forEach((ticket) => {
                    combinations.forEach((combination) => {

                        let entry = [];
                        entry.push(this.add(ticket.price, combination[0]));

                        let savedTickets = [];
                        combination[1].forEach((ticket) => {
                            savedTickets.push(ticket)
                        });
                        savedTickets.push(ticket);

                        entry.push(savedTickets);
                        newCombinations.push(entry)
                    });
                });
                combinations = newCombinations
            }
            return this.retrieveCombinationsRecursive(currentPassenger + 1, passengersAmount, combinations)
        }
    }

    /**
     * Create all possible ticket for each passenger, based on their promotion, age and date of travel.
     */
    createAllTickets() {
        this.passengers.forEach((passenger) => {
            passenger.tickets.push.apply(passenger.tickets, this.createNormalTicket("normal", this.clazs, this.roundtrip));

            this.getPromotions(passenger).forEach((promotion) => {
                switch (promotion) {
                    case "senior":
                        passenger.tickets.push.apply(passenger.tickets, this.createNormalTicket("senior", this.clazs, true));
                        break;

                    case "gopass1":
                        passenger.tickets.push.apply(passenger.tickets, this.createNormalTicket("gopass1", 2, this.roundtrip));
                        break;

                    case "weekend":
                    case 1:
                    case 2:
                    case 3:
                        passenger.tickets.push.apply(passenger.tickets, this.createPromotionTicket(promotion));
                        break;

                    default:
                        return
                }
            })
        })
    }

    /**
     * Create promotional tickets: 50% (week-end & promotion), 70% and 75%.
     * The 1st class ticket can only be created if the promotion is a week-end.
     * @param promotion
     * @returns {Array}
     */
    createPromotionTicket(promotion) {
        let tickets = [];

        // Create the first class ticket. Only if the promotion is a week-end.
        if (this.clazs === "1" && promotion === 'weekend') {
            tickets.push(new Ticket("normal", 1, "1", this.roundtrip, this.distance, this.origin, this.destination))
        }
        tickets.push(new Ticket("normal", promotion, "2", this.roundtrip, this.distance, this.origin, this.destination));
        return tickets
    }

    /**
     * Create normal tickets: "normal", "gopass1" and "senior".
     * @param type
     * @param clazs
     * @param roundtrip
     * @returns {Array}
     */
    createNormalTicket(type, clazs, roundtrip) {
        let tickets = [];

        if (clazs === "1") {
            tickets.push(new Ticket(type, 0, "1", roundtrip, this.distance, this.origin, this.destination))
        }
        tickets.push(new Ticket(type, 0, "2", roundtrip, this.distance, this.origin, this.destination));
        return tickets;
    }

    /**
     * Return an array with the complete list of the promotions of a passenger.
     * @param passenger Passenger, the passenger.
     * @returns {Array}, the list of the promotions.
     */
    getPromotions(passenger) {
        let promotions = [];

        // Check promotions based on age
        if (passenger.age < 26) {
            promotions.push('gopass1')
        } else if (passenger.age >= 65) {
            promotions.push('senior')
        }

        // Check promotions based on promotion card and weekend day
        if (passenger.promotion > 1) {
            promotions.push(passenger.promotion)
        } else if (this.isWeekend()) {
            promotions.push('weekend')
        } else {
            promotions.push(passenger.promotion)
        }
        return promotions
    }

    /**
     * Return true if the travelling day is a week-end day.
     * @returns {boolean} true or false.
     */
    isWeekend() {
        return this.date.getDay() === 6 || this.date.getDay() === 0;
    }

    /**
     * Addition of prices with correction factor of 10. Avoid float numeral bugs.
     */
    add(x, y) {
        return (((x * 10) + (y * 10)) / 10)
    }

    removeFirstThingAndPreserveArray(thingArray){
        let copyOfThingArray = [...thingArray];
        copyOfThingArray.shift();
        return copyOfThingArray;
    }
}

module.exports = Travel;
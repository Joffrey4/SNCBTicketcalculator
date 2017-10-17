const FIXED_PRICES = require('./registers/fixedTicketsPrices.json');
let Ticket = require('./Ticket');

class FixedTicket extends Ticket {

    constructor(type, roundtrip, classs, origin, destination) {
        super();

        this.type = type;
        this.roundtrip = roundtrip;
        this.classs = classs;
        this.origin = origin;
        this.destination = destination;

        this.init();
    }

    init() {
        // Ticket price pre-processing
        let classId = this.getClassId();

        // Ticket price calculation
        this.ticketPrice = this.calcPrice(classId);
    }

    /**
     * Calculate the price of the ticket.
     * @param classId The Number identifier for the ticket's class.
     */
    calcPrice(classId) {
        let price = FIXED_PRICES[this.type][classId];

        // Multiply the price by two if it's a roundtrip (not for seniors and bike-day tickets)
        if (this.roundtrip === true && (this.type !== "seniors" && this.type !== "bike-day")) {
            price = price *2;
        }
        return price;
    }
}

module.exports = FixedTicket;

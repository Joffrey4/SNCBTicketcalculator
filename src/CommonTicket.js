const COMMON_PRICES = require('./registers/commonTicketsPrices.json');
let Ticket = require('./Ticket');

class CommonTicket extends Ticket {

    constructor(type, roundtrip, classs, distance, origin, destination) {
        super();

        this.type = type;
        this.roundtrip = roundtrip;
        this.classs = classs;
        this.distance = distance;
        this.origin = origin;
        this.destination = destination;

        this.init();
    }

    init() {
        // Ticket price pre-processing
        let classId = this.getClassId();
        let tabledDistance = this.getTabledDistance(classId, this.distance);

        // Ticket price calculation
        this.ticketPrice = this.calcPrice(classId, tabledDistance);
    }

    calcPrice(classId, tabledDistance) {
        let price = COMMON_PRICES[classId][tabledDistance][this.getReductionId()];

        // Multiply the price by two if it's a roundtrip
        if (this.roundtrip === true) {
            price = price * 2;
        }
        return price;
    }

    /**
     * The prices tables doesn't has an entry for every distance number. This function retrieve
     * the tabled distance associated to the distance.
     * @param classId the class id Number of the ticket.
     * @param distance the traveling distance Number between the origin and destination.
     * @returns {*} the tabled distance Number.
     */
    getTabledDistance(classId, distance) {
        while (COMMON_PRICES[classId][distance] === undefined) {
            distance -= 1;
        }
        return distance;
    }

    /**
     * Return the ID of the promotion (to use in the register) from the ticket type.
     * And save the promotion amount into this object.reduction.
     * @returns {number} the ID of the promotion.
     */
    getReductionId() {
        let reductionId;

        switch (this.type) {

            case "group":
                this.reduction = 70;
                reductionId = 2;
                break;

            case "weekend":
            case "intervention":
            case "family":
                this.reduction = 50;
                reductionId = 1;
                break;

            case "standard":
            default:
                this.reduction = 0;
                reductionId = 0;
        }

        return reductionId;
    }
}

module.exports = CommonTicket;
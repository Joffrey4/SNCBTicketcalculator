
class Ticket {

    /**
     * Return the ID of the class (to use in the register) from the class number.
     * @returns {number} the ID of the class.
     */
    getClassId() {
        if (this.classs === 1) {
            return 1;
        } else {
            return 0;
        }
    }

    get price() {
        return this.ticketPrice;
    }
}

module.exports = Ticket;
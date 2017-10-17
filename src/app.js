let CommonTicket = require('./CommonTicket');
let FixedTicket = require('./FixedTicket');
let DistanceCalculator = require('./modules/distanceCalculator/DistanceCalculator');

let Dijkstras = require('./modules/distanceCalculator/Dijkstras');

let ticket1 = new CommonTicket("standard", false, 2, 102, "charleroi", "namur");
console.log(ticket1.price);

let ticket2 = new FixedTicket("go-pass1", true, 2, "charleroi", "namur");
console.log(ticket2.price);

let distance = new DistanceCalculator('A', 'D');

console.log(distance.distance);
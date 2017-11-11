let CommonTicket = require('./CommonTicket');
let FixedTicket = require('./FixedTicket');
let DistanceCalculator = require('./modules/distanceCalculator/DistanceCalculator');

//let ticket1 = new CommonTicket("standard", false, 2, 102, "charleroi", "namur");
//console.log(ticket1.price);

//let ticket2 = new FixedTicket("go-pass1", true, 2, "charleroi", "namur");
//console.log(ticket2.price);

let distance = new DistanceCalculator('zottegem', 'gent-sint-pieters');
console.log(distance.distance);

let distance2 = new DistanceCalculator('gent-sint-pieters', 'zottegem');
console.log(distance2.distance);

/*
let distance5 = new DistanceCalculator('engis', 'pont-de-seraing');
console.log(distance5.distance);

let distance6 = new DistanceCalculator('pont-de-seraing', 'engis');
console.log(distance6.distance);

let distance3 = new DistanceCalculator('rochefort-jemelle', 'haversin');
console.log(distance3.distance);

let distance4 = new DistanceCalculator('haversin', 'rochefort-jemelle');
console.log(distance4.distance);
*/
const DISTANCES = require('./stationDistances.json');
let fs = require('fs');
let path = require('path');

function stationDistancesArrayGenerator () {
    let generatedArray = [];

    // For each origin's station
    for (let origin in DISTANCES) {
        let destinations = DISTANCES[origin];
        let stationArray = [];

        // And for each destination's station
        for (let destination in destinations) {
            stationArray.push([destination, destinations[destination]])
        }

        // Rewrite in an array
        generatedArray.push([origin, stationArray]);
    }

    fs.writeFile(path.join(__dirname, "stationDistancesArray.json"), JSON.stringify(generatedArray), function(err) {
        if(err) {
            return console.log(err);
        }
    });
}

stationDistancesArrayGenerator();
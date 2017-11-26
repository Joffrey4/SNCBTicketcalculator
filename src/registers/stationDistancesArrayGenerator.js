"use strict";

const DISTANCES = require('./stationDistances.json');
let fs = require('fs');
let path = require('path');

function checkConsistancy() {
    let errors = 0;

    // Take each substation of a station
    for (let origin in DISTANCES) {
        let destinations = DISTANCES[origin];
        for (let destination in destinations) {

            // Check the reciprocity of the vectors between the stations
            if (DISTANCES[destination]) {
                if (!DISTANCES[destination][origin]) {
                    console.log("ERR RECIP. Station " + origin + " does not exists in " + destination + ". Referenced from " + origin + ";");
                    errors += 1;
                } else {

                    // Check the reciprocity of the vectors' values
                    if (destinations[destination] > 0 && DISTANCES[destination][origin] > 0) {

                        if (destinations[destination] !== DISTANCES[destination][origin]) {
                            console.log("ERR DIST." + destinations[destination] + " is not equal to " + DISTANCES[destination][origin]);
                            errors += 1;
                        }
                    } else {
                        console.log("ERR VALUE." + destinations[destination] + " or " + DISTANCES[destination][origin] + " are equal to 0.");
                        errors += 1;
                    }
                }
            } else {
                console.log("ERR EXIST. Station " + destination + " does not exists. Referenced in " + origin + ";");
                errors += 1;
            }
        }
    }

    if (errors === 0) {
        console.log("Consistancy checking terminated. No errors found.")
    } else {
        console.log("Consistancy checking found " + errors + "  errors.")
    }
}

function checkConsistency2() {

}

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
        } else {
            console.log("Station distance array generator runned sucessfully.")
        }
    });
}

checkConsistancy();
//stationDistancesArrayGenerator();
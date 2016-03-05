#!/usr/bin/env node

var fs          = require('fs'),
    constraints = require('./constraints.js');

var residents   = [constraints.residents[0]],
    vacRot      = constraints.vacationRotations,
    monthMap    = constraints.monthMap;

// To use this, you'll need to install the node module `split`
// If you find that this is _still_ too slow, you can use GNU Parallel http://www.gnu.org/software/parallel/
// which you can install with `brew install parallel`

// This file assumes the presence of a text file containing numbers on each line.
// chmod 755 pipes.js
// cat combos.txt | ./pipes.js

// Our test function: is the nth digit of the string n?
var vacationFit = function( oneCombo, resident ) {

    var fits = false;
// console.log('vac months:', resident.vacationMonths)
    // For every desired month
    for ( var monthi = 0; monthi < resident.vacationMonths.length; monthi++ ) {

        var monthNum = monthMap[ resident.vacationMonths[ monthi ] ];
        // Get the rotation number from the current desired month
        // in the current schedule
        var rotationNum = oneCombo[ monthNum ];
// console.log('month:', monthNum, ', rotNum:', rotationNum)
        // If that number is one of the rotations that allow vacations, add it
        if ( vacRot.indexOf( rotationNum ) > -1 ) {
            // console.log('rotation fits!')
            fits = true;
        }
    }  // end for every desired month

    return fits
};  // End vacationFit()

var count = 0;
var processLine = function(line ) { // The function to run when we get a new line from the stream

    var temp    = line.split(','),
        sched   = [];
    temp.forEach( function( rot, indx, arr ) {
        sched.push( parseInt( rot ) );
    });

    for ( var resi = 0; resi < residents.length; resi++ ) {
        var resident = residents[ resi ];

        if ( vacationFit( sched, resident ) ) {
            resident.possible.push( sched );
        }
    }

    if ( count === 3142798 ) {
        fs.writeFile( 'residents-data.txt', JSON.stringify(residents[0].possible.slice(-10)) );
    }
    count += 1;

}  // End processLine()

// Set up a new pipe, split on new lines, and run processLine when we get a new line
process.stdin.pipe(require('split')()).on('data', processLine)
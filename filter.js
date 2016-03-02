/* by-rank.js
* 
* TODO:
* - ??: Somehow keep track of which resident's schedule is
* 	being most difficult?
* - ??: Somehow make sure residents can't reject slots that
* 	they've already scheduled/say they want
* 
*/

var fs = require('fs');
var constraints = require('./constraints.js');

'use strict';

var combos 		= fs.readFileSync('combos-test.json')
var combosArr 	= JSON.parse(combos);

var residents 	= constraints.residents,
	rotations 	= constraints.rotations,
	tracker 	= constraints.requirementTracker,
	rotationMap = constraints.rotationMap,
	monthMap 	= constraints.monthMap;


// This isn't the way to do it. We need to keep track at each point or something, which is 10! I think
var progress 	= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


var tooMany = function ( sched ) {
// Depends on global var `tracker`

	var exceedsLimit = false;

	for ( var monthi = 0; monthi < sched.length; monthi++ ) {

		// Get the index of the rotation so we can find it in the rotation list
		var rotationIndx = sched[ monthi ];
		// and in the requirements tracker. Get a temporary number to check against requirements
		var tempAdd = tracker[ rotationIndx ][ monthi ] + 1;

		// Get the max allowed in this rotation in this month
		var max = rotations[ rotationIndx ].perMonth[ monthi ].max;

		// If any of the rotationsn go over the limit, this schedule won't work
		if ( tempAdd > max ) { exceedsLimit = true; }
	}

	return exceedsLimit;
};  // End tooMany()


var trackItUp = function ( resident ) {
// Depends on global var `tracker`
// Updates the program requirements tracker with +1 to the rotation
// in each month of the schedule

	var sched = resident.schedule

	for ( var monthi = 0; monthi < sched.length; monthi++ ) {
		var rotationIndx = sched[ monthi ];
		tracker[ rotationIndx ][ monthi ] = tracker[ rotationIndx ][ monthi ] + 1
	}

	return resident;
};  // End trackItUp()


var itsPossible = function( resident, schedIndex, allBefore ) {
// Recursive?
	var result;

	// If none of the schedules have worked, go back a step
	if ( resident.possible[ schedIndex ] === undefined ) {
		result = null;
	}
	
	// Try next possible schedule
	var curr = resident.possible[ schedIndex ];

	// Make sure it fulfills the program reqs - doesn't clash with any prev
	// schedules
	var programOk = !tooMany( curr );

	// If it does both those things, update the reqs
	if ( !programOk ) {
		result = curr;
		// ??: Somehow store that this is how far we got with this resident on this round

	// If not, try the next schedule
	} else {
		result = itsPossible( resident, schedIndex + 1, allBefore, requirements );
	}

	return result;
};  // End itsPossible()


var schedules 	= [];

var withSeed = function ( residents ) {
// Not sure how to keep track of stuff, or how to recurse
	var result = [];

	for ( var resi = 0; resi < residents.length; resi++ ) {
		// Start with a seed resident
		var resident = residents[ resi ];

		// Pick a schedule that works with all the previous schedules
		var currSched;
		if ( resi === 0 ) {

			currSched = resident.possible[ progress[ resident.indx ] ];
			// Store our progress... with this one... How do I store more in future?
			progress[ resident.indx ] = progress[ resident.indx ] + 1;

		} else {
			currSched = itsPossible( resident, 0, result );
		}

		// If we're stuck with no result on an iteration
		if ( currSched === null ) {
			// Actually need to try again with a different possibility
			// for the first resident? Not sure how to do that

			var next = resident.possible[ progress[resident.indx] ];
			if ( next !== undefined ) {
				// Do something to try with that schedule
			} else {
				// Try again with the list in a different order, different seed
				var last = residents.pop();
				residents.shift( last );
				result = withSeed( residents );
			}

		// If this worked fine	
		} else {

			// Save this schedule
			resident.schedule = currSched;
			// Update the requirements tracker
			trackItUp( resident );

			// Add this resident and schedule to the result
			result.push( { name: resident.name, sched: resident.schedule } );
		}

		// For last resident, check if there are enough doctors for rotations
		// that have a min > 0??

	}

	return result;
};


// ============================
// POSSIBLE SCHEDULES
// ============================
var vacationLimitation = function( vacations, index, rotationsObj ) {
// Recursive, right? Returns the possible schedules available to someone with
// vacations requested in their vacations array

	var key = vacations[ index ],
		result = null;

	if ( key !== undefined ) {
		result = vacationLimitation( vacations, index + 1, rotationsObj[ key ] );
	} else {
		result = rotationsObj[ 'All' ];
	}

	return result
};  // End vacationLimitation()


var mustExterminate = function( sched, unwanted ) {
/*
Figures out if this schedule contains stuff the resident
doesn't want
unwanted takes the form [{ month: str, rotation: str }]
*/
	var reject = false;

	for ( var uni = 0; uni < unwanted.length; uni++ ) {

		var currReject 	= unwanted[ uni ],
			rotationi 	= rotationMap[ currReject.rotation ],
			monthi 		= monthMap[ currReject.month ];

		// If that month in the schedule contains the rejected rotation, reject
		// If any of rejected slots are hit, it will be rejected
		if ( sched[ monthi ] === rotationi ) { reject = true; }
	}

	return reject;
};  // End mustExterminate()


var upToSnuff = function( sched, wanted ) {
/*
Makes sure the schedule contains the slots desired
*/
	var accept = false;

	for ( var wantedi = 0; wantedi < unwanted.length; wantedi++ ) {

		var desired 	= wanted[ wantedi ],
			rotationi 	= rotationMap[ desired.rotation ],
			monthi 		= monthMap[ desired.month ];

		// If that month in the schedule contains the accepted rotation, accept
		// If any of accepted slots are hit, it will be accepted
		if ( sched[ monthi ] === rotationi ) { accept = true; }
	}

	return accept;
};  // End upToSnuff()


var customLimiters = function( resident, possible ) {
/*

Takes out schedules that don't mesh with either already
scheduled months/rotations or months/rotations that are
specifically not desired
*/
	var unwanted = resident.rejects,
		booked 	 = resident.scheduled,
		actual 	 = [];

	for ( var schedi = 0; schedi < possible.length; schedi++ ) {

		var sched = possible[ schedi ];

		// If it contains the slots the resident say they want
		var hasDesired = upToSnuff( sched, resident.scheduled );
		if ( hasDesired ) {
			// and doesn't contain slots the resident has rejected
			var reject = mustExterminate( sched, resident.rejects );
			if ( !reject ) {
				// add it to the list of their possible schedules
				actual.push( sched );
			}
		}

	}

	return actual;
};  // End customLimiters()

// Assign all possible schedules to each resident
for ( var resi = 0; resi < residents.length; resi++ ) {
	// Start with a seed resident
	var resident = residents[ resi ];

	// Get their list of possible schedules using their vacation months
	var possible = vacationLimitation( residents.vacationMonths, 0, {All: [ [1, 2, 3, 4] ] } );  // Actually use dict of months to patterns
	resident.possible = customLimiters( resident, possible );

	// If this is the case, something has gone wrong earlier on.
	// Try to figure it out and tell the person running the program
	// TODO: Better - try to make sure this can't possibly happen by limiting input
		// No rejections same as desired slots
		// No vacations more than there are vacation months
	if (resident.possible.length <= 0 ) {
		console.error('Hmm, no schedule for this resident?', resident );
	}
}





// ======================================
// Testing
// ======================================
var rotObj = {
	All: [],
	Jan: {
		All: [
			[8,7,6,5,4,1,3,1,2,3,1,1],
			[8,7,6,5,4,1,3,2,1,3,1,1],
			[8,7,6,5,4,2,1,3,1,1,3,1],
			[8,7,6,5,4,2,1,3,1,3,1,1]
		],
		Feb: {
			All: [
				[8,7,6,5,4,1,3,1,2,3,1,1],
				[8,7,6,5,4,1,3,2,1,3,1,1],
				[8,7,6,5,4,2,1,3,1,1,3,1],
				[8,7,6,5,4,2,1,3,1,3,1,1]
			],
			Aug: {
				All: [
					[8,7,6,5,4,2,1,3,1,1,3,1],
					[8,7,6,5,4,2,1,3,1,3,1,1]
				]
			}
		}
	},
	Dec: {
		All: [
			[1,1,3,1,1,3,2,4,5,6,7,8],
			[1,1,3,1,1,3,2,4,5,6,8,7],
			[1,1,3,1,1,3,2,4,5,7,6,8]
		]
	}
};

console.log( vacationLimitation( ['Jan', 'Feb', 'Aug'], 0, rotObj ) );
// Result should be: [[8,7,6,5,4,2,1,3,1,1,3,1], [8,7,6,5,4,2,1,3,1,3,1,1]]

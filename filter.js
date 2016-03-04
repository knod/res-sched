/* filter.js
* 
* TODO:
* - ??: Somehow keep track of which resident's schedule is
* 	being most difficult?
* - ??: Somehow make sure residents can't reject slots that
* 	they've already requested/say they want
* 
*/

var fs 				= require('fs');
var constraints 	= require('./constraints.js');
var convertMonth 	= require('./convert-one-month.js');

'use strict';

// var combosFile 	= fs.readFileSync('combos-test.json');
var combosFile 	= fs.readFileSync('combos.json');
var combosArr 	= JSON.parse(combosFile);

// var path = '../../../Dropbox/ResSchedule'
// var testDir = fs.readdir(path, function(err, items) { console.log(items); })
// var test 		= fs.readFileSync('../../../Dropbox/ResSchedule/1_2_3.csv')
// test = test.toString()
// console.log( test[0] );

// Path to where combo data by vacation month is kept, in format for fs.readFile()
var monthsDir 	= '../../../Dropbox/ResSchedule';

// var residents 	= [constraints.residents[0], constraints.residents[1]],
var residents 	= constraints.residents,
// var residents 	= constraints.residents.splice(-6),
	rotations 	= constraints.rotations,
	vacRot 		= constraints.vacationRotations,
	tracker 	= constraints.requirementTracker,
	rotationMap = constraints.rotationMap,
	monthMap 	= constraints.monthMap;


// This isn't the way to do it. We need to keep track at each point or something, which is 10! I think
var progress 	= [0, 0, 0, 0, 0, 0, 0, 0, 0, 0];


var blankProgress = function( residents ) {

	var progress = [];

	for ( var resi = 0; resi < residents.length; resi++ ) {
		progress.push(0)
	}

	return progress;
};  // End blankProgress()


var rankProgress = function( progress, ranked ) {

	// var topIndx = 0,
	// 	topVal 	= progress[ topIndx ];

	// var withRank = []

	// for ( var progi = 0; progi < progress.length; progi++ ) {

	// 	var val = progress[ progi ];

	// 	if ( val < topVal ) {
	// 		topIndx = progi;
	// 		topVal 	= val;
	// 	}
	// }

	// // var score = progress[ progi ];
	// // // Want to make sure that none of the values could be bigger than that score. I think.
	// // score 	 += score + (1000000000 * progi);

};  // End rankProgress()


var rankProgress = function( progress, ranked ) {

	// var worstIndx = 0,
	// 	worstVal  = progress[ worstIndx ];

	// var indxAndVal = {};

	// for ( var progi = 0; progi < progress.length; progi++ ) {
	// 	var val = progress[ progi ];
	// 	indxAndVal[ progi ] = val;
	// }

	// var sortable = [];
	// for (var indx in indxAndVal) {
	// 	sortable.push( [ indx, indxAndVal[ indx ] ] );
	// }

	// sortable.sort( function(a, b) {
	// 	return a[1] - b[1]
	// })

};  // End rankProgress()


var rankProgress = function( progress ) {
// Returns list of progress indexes sorted by the values
// that were in those indexes
	var worstIndx = 0,
		worstVal  = progress[ worstIndx ];

	var indxAndVal = [];

	for ( var progi = 0; progi < progress.length; progi++ ) {
		var val = progress[ progi ];
		indxAndVal.push( {indx: progi, val: val } );
	}

	indxAndVal.sort( function(a, b) { return a.val - b.val })

	// Use the sorted list of objects to make a list of just indexes
	var sorted = [];
	for ( var indxi = 0; indxi < indxAndVal.length; indxi++ ) {
		sorted.push( indxAndVal[ indxi ].indx );
	}

	return sorted;
};  // End rankProgress()


var onwardHo = function( residents, progress ) {
// Increment the indexes that will be used to get schdules,
// sort of "breadthwise". Don't progress if there aren't schedules
// left to progress with.

	var wasIncremented = false;

	// Rank each index of progress according to value and highest index
	var rankedIndexes = rankProgress( progress );

	for ( var indxi = 0; indxi < rankedIndexes.length; indxi++ ) {

		if ( !wasIncremented ) {

			var indx 			= rankedIndexes[ indxi ],
				nextSchedIndx 	= progress[ indx ] + 1,
				// Look at the possible schedules of the resident at that progress slot
				possible 		= residents[ indx ].possible;

			// If there are more schedules left, progress the resident
			if ( possible[ nextSchedIndx ] !== undefined ) {
				progress[ indx ] = nextSchedIndx;
				wasIncremented 	 = true;
			}
		}  // end if nothing can be incremented yet
	}  // end for every ranked index

	// If we weren't able to increment anything, this is a dead end
	if (!wasIncremented) {
		progress = null;
	}

	return progress;
};  // End onwardHo()


var rankResult = function( sched ) {

	// var clone = sched.slice(),
	// 	rank = clone.reduce(function(a, b) {
	// 		return a + b;
	// 	});

	// return rank;
};  // End rankResult()


var rankResult = function( resultArray ) {
// resultArray = [ { resident: resident, sched: schedule, rank: sched index } ]
// Adds up the ranks of all the resident's schedules to get a final rank for
// the year's/program's whole schedule

	var rank = 0;

	for ( var resi = 0; resi < resultArray.length; resi++ ) {
		rank += resultArray[ resi ].rank;
	}

	return rank;
};  // End rankResult()


var didTheBareMinimum = function () {
// Depends on global var `tracker` and `rotations`
// rotations = [ {}, {...perMonth: [ {min: #, max: #} * 12 ]} ]
// tracker = [ [], [# * 12] ]
// Same indexes for rotations and for tracker
	var meetsMins = true;

	// Remember, these start at 1 because of brobot's data generation methods (uses R)
	for ( var roti = 1; roti < tracker.length; roti++ ) {

		var requirementsRot = rotations[ roti ],
			trackerRot 		= tracker[ roti ];

		// For every month in every rotation requirements and tracker accumulations
		for ( var monthi = 0; monthi < requirementsRot.length; monthi++ ) {
			// Get the minimum requirement for residents per month
			var min 	= requirementsRot[ monthi ].min,
				actual 	= trackerRot[ monthi ];
			// If even one minimum requirement isn't met, this schedule isn't valid
			if ( actual < min ) { meetsMins = false; }
		}
	}  // end for every tracker and requirement rotation record

	return meetsMins;
};  // End didTheBareMinimum()


var tooMany = function ( sched, tracker ) {

	var exceedsLimit = false;

	for ( var monthi = 0; monthi < sched.length; monthi++ ) {

		// Get the index of the rotation so we can find it in the rotation list
		var rotationIndx = sched[ monthi ];
		// and in the requirements tracker. Get a temporary number to check against requirements
		var tempAdd = tracker[ rotationIndx ][ monthi ] + 1;

		// Get the max allowed in this rotation in this month
		var max = rotations[ rotationIndx ].perMonth[ monthi ].max;

		// If any of the rotationsn go over the limit, this schedule won't work
		if ( tempAdd > max ) { exceedsLimit = true; }//console.log('exceeds limit? how? max:', max, ', temp:', tempAdd, ', rotIndx:', rotationIndx, ', month:', monthi )}
	}

	return exceedsLimit;
};  // End tooMany()


var trackItUp = function ( resident ) {
// Depends on global var `tracker`
// Updates the program requirements tracker with +1 to the rotation
// in each month of the schedule

	// var sched = resident.schedule

	// for ( var monthi = 0; monthi < sched.length; monthi++ ) {
	// 	var rotationIndx = sched[ monthi ];
	// 	tracker[ rotationIndx ][ monthi ] = tracker[ rotationIndx ][ monthi ] + 1
	// }

	// return resident;
};  // End trackItUp()


var trackItUp = function ( sched, tracker ) {
// Updates the program requirements tracker with +1 to the rotation
// in each month of the schedule

	for ( var monthi = 0; monthi < sched.length; monthi++ ) {
		var rotationIndx = sched[ monthi ];
		tracker[ rotationIndx ][ monthi ] = tracker[ rotationIndx ][ monthi ] + 1
	}

	return sched;
};  // End trackItUp()


var itsPossible = function( resident, schedIndex, allBefore ) {
// Recursive?
	// s
};  // End itsPossible()


var withSeedOneResult = function( residents, progress ) {
// Does one cycle with a seed of residents in a random order using
// progress to try new schedules "breadthwise" until something works
// Returns
// { scheds: [ {resident: {}, schedule: [], rank: #} ], rank: # }

	var result = {
		scheds: [],
		rank: 0
	};

	var thisTracker = JSON.parse(JSON.stringify( tracker ));  // global object `tracker`

	for ( var resi = 0; resi < residents.length; resi++ ) {

		// Get the schedule at the current point of progress
		var schedIndx 	= progress[ resi ],
			resident 	= residents[ resi ],
			sched 		= resident.possible[ schedIndx ];

		var meetsReqs 	= !tooMany( sched, thisTracker );

		// If there's a non-match
		if ( !meetsReqs ) {

			// Progress forward and try again from the start?
			progress = onwardHo( residents, progress );
			// If this arrangment is a dead end, get a new seed
			if (progress === null) { return null; }

			result = withSeedOneResult( residents, progress );
			// Get outta here. If we got success, we don't want to keep
			// looping through residents anymore
			break;

		// If we found a schedule that works
		} else {
			// Increment the tracker so we can match against the next one
			trackItUp( sched, thisTracker );

	// console.log('--------- progress:', progress );
	// console.log('```````````` sched:', sched );
			// Rank each result so we can add them at the end?
			result.scheds.push( {
				resident: resident,
				schedule: sched,
				rank: schedIndx
			} )  // add it and go to the next resident
		}
	}

	// // Make sure we've covered the minimums
	// var metMins = didTheBareMinimum();
	var metMins = true;

	// If so, move on
	if ( metMins ) {
		// Make sure to rank the result
		// result.rank = rankResult( result );  // Can't do this while testing with no metMins

	// If not, progress and try again
	} else {
		progress = onwardHo( progress );
		// If this arrangment is a dead end, get a new seed
		if (progress === null) { return null; }

		result = withSeedOneResult( residents, progress );
		// The thing that will be returned will be ranked already
		// The terrible beauty of recursion
	}

	// console.log('result.scheds:', result.scheds, result.scheds[0]);
	// This assumes a result will always be found. What happens
	// if incrememnting progress doesn't work
	return result;
};  // End withSeedOneResult()


var shuffle = function( array ) {
// Shuffles an array in place
// http://stackoverflow.com/questions/6274339/how-can-i-shuffle-an-array-in-javascript

	for ( var indx = array.length; indx; indx -= 1 ) {
		var random 	= Math.floor( Math.random() * indx );
		// Store the value in the previous slot. We're going to replace it,
		// but want to be able to put it back in after so we still have all the items
		var prev 	= array[ indx - 1 ];
		// Put the random item in the previous spot
		array[ indx - 1 ] = array[ random ];
		// Put the previous item in the place where the random item was
		array[ random ] = prev;
	}

	return array;
};  // End shuffle()


// // ??: Should use indexes of residents below so we can keep track
// // of what's been tried?
// var resCombosUsed = [];
var generateYears = function( residents, numWanted ) {
// Returns
// [ { scheds: [ {resident: {}, schedule: [], rank: #} ], rank: # } ]

	var results 	= [],
		// 1/3.6 mill chance of getting the same combo of residents
		randomized 	= shuffle( residents.slice() ),
		progress 	= blankProgress( randomized );

	// console.log('---- seed:', randomized[0].name );
	for ( var done = 0; done < numWanted; done++ ) {
		var result = withSeedOneResult( randomized, progress );

		if (result !== null) {
			// TODO: Remember successes and never try them again
			results.push( result );
		// If we got nothing back, make sure to re-do this round
		} else {
			// TODO: Remember dead ends and never try them again
			done -= 1;
		}

	}

	// Store results somewhere (id by what info was provided?)

	return results;
};  // End generateYears()


// var withSeed = function ( residents ) {
// // Not sure how to keep track of stuff, or how to recurse
	// var result = [];

	// var randomized 	= shuffle( residents.slice() ),
	// 	progress 	= blankProgress( randomized );

	// for ( var resi = 0; resi < randomized.length; resi++ ) {
	// 	// Start with a seed resident
	// 	var resident = randomized[ resi ];

	// 	// Pick a schedule that works with all the previous schedules
	// 	var currSched;
	// 	if ( resi === 0 ) {

	// 		currSched = resident.possible[ progress[ resident.indx ] ];
	// 		// Store our progress... with this one... How do I store more in future?
	// 		progress[ resident.indx ] = progress[ resident.indx ] + 1;

	// 	} else {
	// 		currSched = itsPossible( resident, 0, result );
	// 	}

	// 	// If we're stuck with no result on an iteration
	// 	if ( currSched === null ) {
	// 		// Actually need to try again with a different possibility
	// 		// for the first resident? Not sure how to do that

	// 		var next = resident.possible[ progress[resident.indx] ];
	// 		if ( next !== undefined ) {
	// 			// Do something to try with that schedule
	// 		} else {
	// 			// Try again with the list in a different order, different seed
	// 			var last = randomized.pop();
	// 			randomized.shift( last );
	// 			result = withSeed( randomized );
	// 		}

	// 	// If this worked fine	
	// 	} else {

	// 		// Save this schedule
	// 		resident.schedule = currSched;
	// 		// Update the requirements tracker
	// 		trackItUp( resident );

	// 		// Add this resident and schedule to the result
	// 		result.push( { name: resident.name, sched: resident.schedule } );
	// 	}

	// 	// For last resident, check if there are enough doctors for rotations
	// 	// that have a min > 0??

	// }

	// if ( result.length >= 10 ) {
	// 	return result;
	// } else {
	// }
// };  // End withSeed()


// ============================
// POSSIBLE SCHEDULES
// ============================
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

	// If there aren't any specified, every schedule is fine
	if ( !(wanted.length > 0) ) { return true; }

	var accept = false;

	for ( var wantedi = 0; wantedi < wanted.length; wantedi++ ) {

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
requested months/rotations or months/rotations that are
specifically not desired
*/
	var unwanted = resident.rejected,
		booked 	 = resident.requested,
		actual 	 = [];

	for ( var schedi = 0; schedi < possible.length; schedi++ ) {

		var sched = possible[ schedi ];

		var hasDesired = upToSnuff( sched, resident.requested );
		if ( hasDesired ) {
			// and doesn't contain slots the resident has rejected
			var reject = mustExterminate( sched, resident.rejected );
			if ( !reject ) {
				// add it to the list of their possible schedules
				actual.push( sched );
			}
		}
	}

	return actual;
};  // End customLimiters()


var addVacations = function( resident, possible ) {

	var extras = resident.extraVacationMonths;

	// If there are no more to add, limits with, don't add any more
	if ( extras.length <= 0 ) { return possible; }

	// Otherwise, get all the months without those vacation months in them
	var actual = [];
	for ( var schedi = 0; schedi < possible.length; schedi++ ) {
	// For each possible schedule

		var sched = possible[ schedi ];
		// For each desired rotation month
		for ( var monthi = 0; monthi < extras.length; monthi++ ) {

			var monthNum = monthMap[ extras[ monthi ] ];
			// Get the rotation number from the current desired month
			// in the current schedule
			var rotationNum = sched[ monthNum ];

			// If that number is one of the rotations that allow vacations, add it
			if ( vacRot.indexOf( rotationNum ) ) {
				actual.push( sched )
			}

		}  // end for every desired month
	}  // end for every possible schedule

	return actual;
};  // End addVacations()


var vacationLimitation = function( vacations, index, rotationsObj ) {
// Recursive, right? Returns the possible schedules available to someone with
// vacations requested in their vacations array

	// var key 	= vacations[ index ],
	// 	result 	= null;

	// if ( key !== undefined ) {
	// 	result = vacationLimitation( vacations, index + 1, rotationsObj[ key ] );
	// } else {
	// 	result = rotationsObj[ 'All' ];
	// }

	// return result;
};  // End vacationLimitation()


var vacationLimitation = function( vacations ) {
// MAX 3 VACATIONS IN THIS PARAMETER!!!
// Access files instead Returns the possible schedules available to someone with
// vacations requested in their vacations array
// In a file, each row is one index number. The numbers/indexes start at 1, not 0
// add 1? subtract 1?

	var filename 	= '',
		result 		= [];

	for ( var vaci = 0; vaci < vacations.length; vaci++ ) {

		// This assumes we get months as a string of Jan, Feb, etc., not ints
		// brobot started with Jan = 1;
		var month = monthMap[ vacations[ vaci ] ] + 1;
		filename += month;
		if ( vaci !== vacations.length - 1 ) { filename += '_' }

	}

	// Get file with info ordered by vacation months
	// var file 	= fs.readFileSync( monthsDir + '/' + filename + '.json' ),
	// 	indexes = JSON.parse( file );
	var indexes = convertMonth( monthsDir + '/' + filename + '.csv' );

	// This array just contains the indexes of the actual combos in the main combo array
	// Get the actual combos
	for ( var i = 0; i < indexes.length; i++ ) {
		// if ( i === 0 ) { console.log( 'filename:', filename, ', check first entry, should be one more that;', combosArr[ indexes[i] - 1 ] ) }  // Shows we get the right indexes - check against file

		// brobot started schedule combo indexes at 1
		result.push( combosArr[ indexes[i] - 1 ] );
	}

	return result;
};  // End vacationLimitation()



var simplify = function( optionsArray ) {

	var simplified = [];

	for ( var opi = 0; opi < optionsArray.length; opi++ ) {
		var option = optionsArray[ opi ].scheds;

		var simpleOption = [];

		for ( var resi = 0; resi < option.length; resi++ ) {
			var res = option[ resi ];
			var simpleRes = {
				name: res.resident.name,
				schedule: res.schedule
			}

			simpleOption.push( simpleRes );
		}

		simplified.push( simpleOption );
	}  // End for each option

	return simplified;
};  // End simplify()



// =============================
// DO IT!
// =============================
var sortOptions = function( options ) {
// `options` = [ { scheds: [ {resident: {}, schedule: [], rank: #} ], rank: # } ]

	// I think it's like golf in that we want the lowest rank #
	options.sort(function(a, b) {
		return a.rank - b.rank
	})

	return options;
};  // End sortOptions()


var getOptions = function( residents, numWanted ) {
// This is all with a specific set of input for the program
// If we get different input, all bets are off, though maybe
// we should save the results we got from the old inputs

	// Assign all possible schedules to each resident
	for ( var resi = 0; resi < residents.length; resi++ ) {//residents.length; resi++ ) {
		// Start with a seed resident
		var resident = residents[ resi ];

		// Get their list of possible schedules using their vacation months
		// var possible = vacationLimitation( residents.vacationMonths, 0, {All: [ [1, 2, 3, 4] ] } );  // Actually use dict of months to patterns
		var possible 	  = vacationLimitation( resident.vacationMonths );  // Actually use dict of months to patterns
		possible 		  = addVacations( resident, possible );
		resident.possible = customLimiters( resident, possible );

		// If this is the case, something has gone wrong earlier on.
		// Try to figure it out and tell the person running the program
		// TODO: Better - try to make sure this can't possibly happen by limiting input
			// No rejections same as desired slots
			// No vacations more than there are vacation months (actually, no more than 3 atm)
			// May want to add way to have additional vacation months
		if (resident.possible.length <= 0 ) {
			console.error('Hmm, no schedule for this resident?', resident.possible );
		}

		console.log( '----------length:', resident.possible.length, ', first:', resident.possible[1] );
	}  // end for every resident, assign possible schedules


	var numWanted = numWanted || 10;  // Later will be option users can set

	var options = generateYears( residents, numWanted );
	// var sorted 	= sortOptions( options );  // Can't do this while testing with no metMins
	var simplified = simplify( options );

	// return sorted;
	// return options;
	return simplified;
};  // End getOptions()


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

// console.log( vacationLimitation( ['Jan', 'Feb', 'Aug'], 0, rotObj ) );
// // Result should be: [[8,7,6,5,4,2,1,3,1,1,3,1], [8,7,6,5,4,2,1,3,1,3,1,1]]
// // Passed 03/02/16 (time?)


// // Ranking progress
// console.log( '-----1-----', rankProgress([1,1,1,1]), 'input: [1,1,1,1], expected: [0,1,2,3]' );
// console.log( '-----2-----', rankProgress([2,2,1,1]), 'input: [2,2,1,1], expected: [2,3,0,1]' );
// console.log( '-----3-----', rankProgress([2,2,1,2]), 'input: [2,2,1,2], expected: [2,0,1,3]' );
// console.log( '-----4-----', rankProgress([2,3,1,2]), 'input: [2,3,1,2], expected: [2,0,3,1]' );
// // Passed 03/02/16 10:06 AM

// Whole thing
var result = getOptions(residents, 1)
console.log( JSON.stringify(result) );//.length, getOptions(residents, 2)[0].scheds );  // Just one
// [
// 	[
// 	{"name":"H","schedule":[1,1,3,1,2,7,3,1,4,5,6,8]},
// 	{"name":"A","schedule":[1,6,3,8,4,1,3,1,2,5,7,1]}
// 	],
// 	[
// 	{"name":"H","schedule":[1,1,3,1,2,7,3,1,4,5,6,8]},
// 	{"name":"A","schedule":[1,6,3,8,4,1,3,1,2,5,7,1]}
// 	],
// 	[
// 	{"name":"H","schedule":[1,1,3,1,2,7,3,1,4,5,6,8]},
// 	{"name":"A","schedule":[1,6,3,8,4,1,3,1,2,5,7,1]}
// 	]
// ]
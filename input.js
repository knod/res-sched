// input.js
// To get month data: http://stackoverflow.com/questions/18285615/get-table-row-column-and-header-jquery

'use strict'

// XX Example
var resInput = [
	{
		name: 'Sally',
		'dh-uh': 'dh',
		// If lock user, loop through months and lock them all
		// If unlock user, return to previous state?
		locked: false,
		months: [
			{
				locked: false,
				// If locked, none of the below will be available to change
				// If non-vacation rotation is selected, unselect this and
				// make it unchangeable
				vacation: true,
				// If the name in this is rejected, it will turn blank,
				// though needs to maintain height
				displayed: 'Elec'
				// toRequest contains all except rejected, displayed,
				// and maybe those without vacations if `vacations` is true
				// ??: Should non-vacation ones just be unselectable in that case?
				// It also shows the displayed thing as selected, unless there's nothing
				// displayed in which case none are selected
				toRequest: [
					{ name:'FMS', available: false },
					{ name:'Rural', available: false },
					{ name:'Elec', available: true },
					{ name:'Cardio', available: true },
					{ name:'W-P', available: true },
					{ name:'Ger', available: true },
					{ name:'pcmh', available: true },
					{ name:'Derm', available: true }
				],
				// Rejected shows all. They look normal unless `vacation` is true,
				// in which case it automatically selects the ones without vacations
				toReject: [
					{ name:'FMS', available: false },
					{ name:'Rural', available: false },
					{ name:'Elec', available: true },
					{ name:'Cardio', available: true },
					{ name:'W-P', available: true },
					{ name:'Ger', available: true },
					{ name:'pcmh', available: true },
					{ name:'Derm', available: true }
				]
			}
		]
	}
];

var Input = function () {

	var input = {};

	input.updateView = function ( resArray ) {

		var nodes;

		for ( var resi = 0; resi < resArray.length; resi++ ) {

		}


		return 
	};  // End input.updateView()


	input.save = function( resNodeList ) {
	// Save and send to back end to be logic-ed
		// Back end resident example
		// {
		// 	name: 'H.', indx: 1, vacationMonths: [/*"May","Jun","Sep"*/], extraVacationMonths: [],
		// 	requested: [ {month: 'Jul', rotation: 'Elec'} ],
		// 	rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
		// }

		for ( var nodei = 0; nodei < resNodeList.length; nodei++ ) {

			var resNode = resNodeList[ resNode ];


		}


	};  // End input.save()



	return input;
};  // End Input() {}


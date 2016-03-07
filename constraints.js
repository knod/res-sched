// constraints.js

'use strict'

var residents = [
	// MAX 3 VACATIONS IN `vacationMonths`!!! OTHERS CAN GO IN `extraVacationMonths`
	// `rejects` is monts and rotations that the resident definitely doesn't want to do
	// each working schedule should be kept with final results
	{
		name: 'H.', indx: 1, vacationMonths: [/*"May","Jun","Sep"*/], extraVacationMonths: [],
		requested: [ {month: 'Jul', rotation: 'Elec'} ],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '06', indx: 5, vacationMonths: [/*"May", "Aug", "Oct"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '09', indx: 8, vacationMonths: [/*"Feb", "Apr", "Jul"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: 'A.', indx: 0, vacationMonths: [ /*"Jan", "Mar" */], extraVacationMonths: [],
		requested: [ {month: 'Jul', rotation: 'Elec'} ],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: 'K.', indx: 2, vacationMonths: [/*"Jul", "Dec"*/], extraVacationMonths: [],
		requested: [ {month: 'Aug', rotation: 'W-P'} ],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: 'B.', indx: 3, vacationMonths: [/*"Feb", "Dec"*/], extraVacationMonths: [],
		requested: [ {month: 'Aug', rotation: 'W-P'} ],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '05', indx: 4, vacationMonths: [/*"May", "Dec"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '08', indx: 7, vacationMonths: [/*"Sep", "Nov"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '10', indx: 9, vacationMonths: [/*"Apr", "Sep"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	},
	{
		name: '07', indx: 6, vacationMonths: [/*"Jun"*/], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: [], 'dh-uh': 'dh'//, schedule: []
	}
];


var numResidents = residents.length,
	numR = numResidents;


var rotations = [
	{},  // Rotation numbers start with 1, so 0 is a placeholder
	{  // 1
		name: 'FMS',
		perMonth: [ {min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3},
			{min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3},
			{min: 4, max: 4}, {min: 2, max: 3}, {min: 2, max: 3},
			{min: 2, max: 3}, {min: 2, max: 3}, {min: 2, max: 3}
		],
		perResident: 4,  // Already fulfilled by pre-made combinations
		easy: false,
		vacation: false
	},
	{  // 2
		name: 'Rural',  // Maybe 0 to 1
		perMonth: [ {min: 0, max: 2}, {min: 0, max: 2}, {min: 0, max: 2},
			{min: 0, max: 2}, {min: 0, max: 2}, {min: 0, max: 2},
			{min: 0, max: 2}, {min: 0, max: 2}, {min: 0, max: 2},
			{min: 0, max: 2}, {min: 0, max: 2}, {min: 0, max: 2}
		],
		perResident: 1,
		easy: false,
		vacation: false
	},
	{  // 3
		name: 'Elec',
		perMonth: [ {min: numR, max: numR}, {min: numR, max: numR}, {min: numR, max: numR},
			{min: numR, max: numR}, {min: numR, max: numR}, {min: numR, max: numR},
			{min: numR, max: numR}, {min: numR, max: numR}, {min: numR, max: numR},
			{min: numR, max: numR}, {min: numR, max: numR}, {min: numR, max: numR}
		],
		perResident: 2,
		easy: true,
		vacation: true
	},
	{  // 4
		name: 'Cardio',
		perMonth: [ {min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1}
		],
		perResident: 1,
		easy: true,
		vacation: false
	},
	{  // 5
		name: 'W-P',
		perMonth: [ {min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2},
			{min: 1, max: 2}, {min: 0, max: 0}, {min: 0, max: 0},
			{min: 0, max: 0}, {min: 1, max: 2}, {min: 1, max: 2},
			{min: 1, max: 2}, {min: 1, max: 2}, {min: 1, max: 2}
		],
		perResident: 1,
		easy: true,
		vacation: false
	},
	{  // 6
		name: 'Ger',
		perMonth: [ {min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1}
		],
		perResident: 1,
		easy: true,
		vacation: true
	},
	{  // 7
		name: 'pcmh',
		perMonth: [ {min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1}
		],
		perResident: 1,
		easy: true,
		vacation: true
	},
	{  // 8
		name: 'Derm',
		perMonth: [ {min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1},
			{min: 0, max: 1}, {min: 0, max: 1}, {min: 0, max: 1}
		],
		perResident: 1,
		easy: true,
		vacation: true
	}
];


// Should be a bit different for DH vs. UH?
// Somehow don't allow vacations for Rural
var vacationRotations = [3, 6, 7, 8];

// Also account for no dh in Cardio with dh in Derm

var rural = { dh: false, uh: true };


var requirementTracker = [
	[],  // Rotation numbers start with 1, so 0 is a placeholder
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 1, FMS
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 2, Rural
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 3, Elective
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 4, Cardiology
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 5, Winter Park
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 6, Geriatrics
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 7, PCMH
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]   // 8, Dermatology
];

var maxes = [
	[],  // Rotation numbers start with 1, so 0 is a placeholder
	[3, 3, 3, 3, 3, 3, 4, 3, 3, 3, 3, 3],  // 1, FMS
	[2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2, 2],  // 2, Rural
	[9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9, 9],  // 3, Elective
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 4, Cardiology
	[2, 2, 2, 2, 0, 0, 0, 2, 2, 2, 2, 2],  // 5, Winter Park
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 6, Geriatrics
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1],  // 7, PCMH
	[1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1, 1]   // 8, Dermatology
];

var rotationMap = {
	'FMS': 1, 'Rural': 2, 'Elec': 3, 'Cardio': 4,
	'W-P': 5, 'Ger': 6, 'pcmh': 7, 'Derm': 8
};

var monthMap = {
	'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
	'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
};

// For node
module.exports = {
	residents: residents, rotations: rotations, requirementTracker: requirementTracker,
	rotationMap: rotationMap, monthMap: monthMap, vacationRotations: vacationRotations
}

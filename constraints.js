// constraints.js

'use strict'


var residents = [
	// MAX 3 VACATIONS IN `vacationMonths`!!! OTHERS CAN GO IN `extraVacationMonths`
	// `rejects` is monts and rotations that the resident definitely doesn't want to do
	// schedule should be kept with final results
	{
		name: 'A', indx: 0, vacationMonths: [ "Jan", "Mar" ], extraVacationMonths: [],
		requested: [ {month: 'Jul', rotation: 'Elective'} ],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: 'H', indx: 1, vacationMonths: ["May","Jun","Sep"], extraVacationMonths: [],
		requested: [ {month: 'Jul', rotation: 'Elective'} ],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: 'K', indx: 2, vacationMonths: ["Jul", "Dec"], extraVacationMonths: [],
		requested: [ {month: 'Aug', rotation: 'Winter Park'} ],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: 'B', indx: 3, vacationMonths: ["Feb", "Dec"], extraVacationMonths: [],
		requested: [ {month: 'Aug', rotation: 'Winter Park'} ],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '5', indx: 4, vacationMonths: ["May", "Dec"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '6', indx: 5, vacationMonths: ["May", "Aug", "Oct"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '7', indx: 6, vacationMonths: ["Jun"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '8', indx: 7, vacationMonths: ["Sep", "Nov"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '9', indx: 8, vacationMonths: ["Feb", "Apr", "Jul"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	},
	{
		name: '10', indx: 9, vacationMonths: ["Apr", "Sep"], extraVacationMonths: [],
		requested: [],
		rejected: [], possible: []//, schedule: []
	}
];

var numResidents = residents.length,
	numR = numResidents;

var rotations = [
	{},  // Rotation numbers start with 1, so 0 is a placeholder
	{  // 1
		name: 'FMS',
		perMonth: { Jan: {min: 2, max: 3}, Feb: {min: 2, max: 3}, Mar: {min: 2, max: 3},
			Apr: {min: 2, max: 3}, May: {min: 2, max: 3}, Jun: {min: 2, max: 3},
			Jul: {min: 4, max: 4}, Aug: {min: 2, max: 3}, Sep: {min: 2, max: 3},
			Oct: {min: 2, max: 3}, Nov: {min: 2, max: 3}, Dec: {min: 2, max: 3}
		},
		perResident: 4,  // Already fulfilled by pre-made combinations
		easy: false,
		vacation: false
	},
	{  // 2
		name: 'Rural',
		perMonth: { Jan: {min: 0, max: 2}, Feb: {min: 0, max: 2}, Mar: {min: 0, max: 2},
			Apr: {min: 0, max: 2}, May: {min: 0, max: 2}, Jun: {min: 0, max: 2},
			Jul: {min: 0, max: 2}, Aug: {min: 0, max: 2}, Sep: {min: 0, max: 2},
			Oct: {min: 0, max: 2}, Nov: {min: 0, max: 2}, Dec: {min: 0, max: 2}
		},
		perResident: 1,
		easy: false,
		vacation: false
	},
	{  // 3
		name: 'Elective',
		perMonth: { Jan: {min: numR, max: numR}, Feb: {min: numR, max: numR}, Mar: {min: numR, max: numR},
			Apr: {min: numR, max: numR}, May: {min: numR, max: numR}, Jun: {min: numR, max: numR},
			Jul: {min: numR, max: numR}, Aug: {min: numR, max: numR}, Sep: {min: numR, max: numR},
			Oct: {min: numR, max: numR}, Nov: {min: numR, max: numR}, Dec: {min: numR, max: numR}
		},
		perResident: 2,
		easy: true,
		vacation: true
	},
	{  // 4
		name: 'Cardiology',
		perMonth: { Jan: {min: 0, max: 1}, Feb: {min: 0, max: 1}, Mar: {min: 0, max: 1},
			Apr: {min: 0, max: 1}, May: {min: 0, max: 1}, Jun: {min: 0, max: 1},
			Jul: {min: 0, max: 1}, Aug: {min: 0, max: 1}, Sep: {min: 0, max: 1},
			Oct: {min: 0, max: 1}, Nov: {min: 0, max: 1}, Dec: {min: 0, max: 1}
		},
		perResident: 1,
		easy: true,
		vacation: false
	},
	{  // 5
		name: 'Winter Park',
		perMonth: { Jan: {min: 1, max: 2}, Feb: {min: 1, max: 2}, Mar: {min: 1, max: 2},
			Apr: {min: 1, max: 2}, May: {min: 0, max: 0}, Jun: {min: 0, max: 0},
			Jul: {min: 0, max: 0}, Aug: {min: 1, max: 2}, Sep: {min: 1, max: 2},
			Oct: {min: 1, max: 2}, Nov: {min: 1, max: 2}, Dec: {min: 1, max: 2}
		},
		perResident: 1,
		easy: true,
		vacation: false
	},
	{  // 6
		name: 'Geriatrics',
		perMonth: { Jan: {min: 0, max: 1}, Feb: {min: 0, max: 1}, Mar: {min: 0, max: 1},
			Apr: {min: 0, max: 1}, May: {min: 0, max: 1}, Jun: {min: 0, max: 1},
			Jul: {min: 0, max: 1}, Aug: {min: 0, max: 1}, Sep: {min: 0, max: 1},
			Oct: {min: 0, max: 1}, Nov: {min: 0, max: 1}, Dec: {min: 0, max: 1}
		},
		perResident: 1,
		easy: true,
		vacation: true
	},
	{  // 7
		name: 'PCMH',
		perMonth: { Jan: {min: 0, max: 1}, Feb: {min: 0, max: 1}, Mar: {min: 0, max: 1},
			Apr: {min: 0, max: 1}, May: {min: 0, max: 1}, Jun: {min: 0, max: 1},
			Jul: {min: 0, max: 1}, Aug: {min: 0, max: 1}, Sep: {min: 0, max: 1},
			Oct: {min: 0, max: 1}, Nov: {min: 0, max: 1}, Dec: {min: 0, max: 1}
		},
		perResident: 1,
		easy: true,
		vacation: true
	},
	{  // 8
		name: 'Dermatology',
		perMonth: { Jan: {min: 0, max: 1}, Feb: {min: 0, max: 1}, Mar: {min: 0, max: 1},
			Apr: {min: 0, max: 1}, May: {min: 0, max: 1}, Jun: {min: 0, max: 1},
			Jul: {min: 0, max: 1}, Aug: {min: 0, max: 1}, Sep: {min: 0, max: 1},
			Oct: {min: 0, max: 1}, Nov: {min: 0, max: 1}, Dec: {min: 0, max: 1}
		},
		perResident: 1,
		easy: true,
		vacation: true
	}
];



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
		name: 'Rural',
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
		name: 'Elective',
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
		name: 'Cardiology',
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
		name: 'Winter Park',
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
		name: 'Geriatrics',
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
		name: 'PCMH',
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
		name: 'Dermatology',
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


var vacationRotations = [3, 6, 7, 8];


var requirementTracker = [
	{},  // Rotation numbers start with 1, so 0 is a placeholder
	{  // 1
		name: 'FMS',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 2
		name: 'Rural',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 3
		name: 'Elective',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 4
		name: 'Cardiology',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 5
		name: 'Winter Park',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 6
		name: 'Geriatrics',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 7
		name: 'PCMH',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	},
	{  // 8
		name: 'Dermatology',
		perMonth: { Jan: 0, Feb: 0, Mar: 0, Apr: 0, May: 0,
			Jun: 0, Jul: 0, Aug: 0, Sep: 0, Oct: 0, Nov: 0, Dec: 0 }
	}
];

var requirementTracker = [
	{},  // Rotation numbers start with 1, so 0 is a placeholder
	{  // 1
		name: 'FMS',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 2
		name: 'Rural',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 3
		name: 'Elective',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 4
		name: 'Cardiology',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 5
		name: 'Winter Park',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 6
		name: 'Geriatrics',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 7
		name: 'PCMH',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	},
	{  // 8
		name: 'Dermatology',
		perMonth: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0]
	}
];

var requirementTracker = [
	[],  // Rotation numbers start with 1, so 0 is a placeholder
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 1, FMS
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 2, Rural
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 3, Elective
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 4, Cardiology
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 5, Winter Park
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 6, Geriatrics
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 7, PCMH
	[0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],  // 8, Dermatology
];

var rotationMap = {
	'FMS': 1, 'Rural': 2, 'Elective': 3, 'Cardiology': 4,
	'Winter Park': 5, 'Geriatrics': 6, 'PCMH': 7, 'Dermatology': 8
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

// schedule.js
// !!: Should I really do this, or should I just make it by
// hand? How much should I do by hand and how much with code? 

'use strict'

var buildSchedule = function ( numResidents ) {

	var schedTable 	 = document.querySelector('.schedule'),
		schedHeaders = schedTable.querySelector('thead').getElementsByTagName('th'),
		schedRows 	 = schedTable.querySelector('tbody');


	var buildRow = function () {};

	for ( var resi = 0; resi < numResidents; resi++ ) {

	}

	return schedTable;
};


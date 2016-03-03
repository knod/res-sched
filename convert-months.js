// convert-months.js
// http://stackoverflow.com/questions/7041638/walking-a-directory-with-node-js
// Converts a folder full of csv files into another folder
// full of json files. Specifically for files with lines
// of csv's that are ints

var fs 				= require( 'fs' );
	montshToJSON 	= require('./convert-months-csv.js');

var csvDir = 'csv-test'; // Folder the files will be in
var jsonDir = 'json-test';

fs.readdir( csvDir, function each(err, list) {

	list.forEach(function convert(filename) {

		var path 	= csvDir + '/' + filename,
			newPath = filename.split('.')[0],
			newPath	= jsonDir + '/' + newPath + '.json';

		montshToJSON( path, newPath );

	});  // end for each file

});  // end readdir()

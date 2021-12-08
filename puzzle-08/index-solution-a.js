const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const lines = fileText.trim().split('\n');
const lineLefts = [];
const lineRights = [];

const getNumbersFromLineHalves = function (lineHalves) {
	return lineHalves.split(' ');
}

lines.forEach(function (line) {
	let splits = line.split(' | ');
	lineLefts.push(getNumbersFromLineHalves(splits[0]));
	lineRights.push(getNumbersFromLineHalves(splits[1]));
})

var sevenSegmentKey = {
	0: 'abcefg',  // 6
	1: 'cf',      // 2
	2: 'acdeg',   // 5
	3: 'acdfg',   // 5
	4: 'bcdf',    // 4
	5: 'abdfg',   // 5
	6: 'abdefg',  // 5
	7: 'acf',     // 3
	8: 'abcdefg', // 7
	9: 'abcdfg'   // 6
}

let total = 0;

lineRights.forEach (function (line) {
	line.forEach (function (number) {
		if (
			number.length === 2
			|| number.length === 4
			|| number.length === 3
			|| number.length === 7
		)
		{
			total += 1;
		}
	})
})

console.log(total);

// console.log(lineRights);
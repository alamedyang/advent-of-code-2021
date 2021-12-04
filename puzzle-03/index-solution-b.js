const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')
const lines = fileText.trim().replace(/\r/g,'').split('\n');

//console.log(lines);


var getColumnOnes = function (lines) {
	let columnOnes = [];
	lines.forEach(function (line) {
		const bits = line.split('');
		// console.log(bits);
		for (let index = 0; index < bits.length; index++) {
			const bit = parseInt(bits[index], 10);
			columnOnes[index] = (columnOnes[index] || 0) + bit;
		}
	})
	return columnOnes;
};

let columnOnes = getColumnOnes(lines);
const columnCount = columnOnes.length;

let oxygenCandidates = lines.slice();
let CO2Candidates = lines.slice();

console.log(oxygenCandidates);

for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
	var temp = [];
	var columnTally = getColumnOnes(oxygenCandidates);
	const columnOneCount = columnTally[columnIndex];
	const columnZeroCount = (oxygenCandidates.length - columnOneCount);
	var targetDigit;
	// console.log(columnTally, columnOneCount, columnZeroCount);
	if (columnOneCount >= columnZeroCount) {
		targetDigit = '1';
	} else {
		targetDigit = '0';
	}
	// console.log(targetDigit);
	oxygenCandidates.forEach(function(line){
		digits = line.split('');
		// console.log(digits);
		if (digits[columnIndex] === targetDigit){
			temp.push(line);
			// console.log(line);
		}
	})
	oxygenCandidates = temp;
	// console.log(oxygenCandidates);
	if (oxygenCandidates.length === 1) {
		break
	}
}

for (let columnIndex = 0; columnIndex < columnCount; columnIndex++) {
	var temp = [];
	var columnTally = getColumnOnes(CO2Candidates);
	const columnOneCount = columnTally[columnIndex];
	const columnZeroCount = (CO2Candidates.length - columnOneCount);
	var targetDigit;
	console.log(columnTally, columnOneCount, columnZeroCount);
	if (columnOneCount >= columnZeroCount) {
		targetDigit = '0';
	} else {
		targetDigit = '1';
	}
	console.log(targetDigit);
	CO2Candidates.forEach(function(line){
		digits = line.split('');
		// console.log(digits);
		if (digits[columnIndex] === targetDigit){
			temp.push(line);
			// console.log(line);
		}
	})
	CO2Candidates = temp;
	if (CO2Candidates.length === 1) {
		break
	}
}

const finalCO2 = parseInt(CO2Candidates[0],2)
const finalOxygen = parseInt(oxygenCandidates[0],2)

const answer = finalCO2 * finalOxygen;

console.log({
	finalOxygen,
	finalCO2,
	answer,
});

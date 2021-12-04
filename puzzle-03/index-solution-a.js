const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')
const lines = fileText.trim().replace(/\r/g,'').split('\n');

//console.log(lines);

let columnOnes = [];

lines.forEach(function (line) {
	const bits = line.split('');
	// console.log(bits);
	for (let index = 0; index < bits.length; index++) {
		const bit = parseInt(bits[index], 10);
		columnOnes[index] = (columnOnes[index] || 0) + bit;
	}
})

// console.log(columnOnes);

const numberCount = lines.length;
const numberSize = lines[0].length;

let gammaRate = [];
let epsilonRate = [];

for (let index = 0; index < numberSize; index++) {
	var oneCount = columnOnes[index];
	var zeroCount = numberCount - oneCount;
	if (oneCount > zeroCount) {
		gammaRate[index] = 1;
		epsilonRate[index] = 0;
	} else {
		gammaRate[index] = 0;
		epsilonRate[index] = 1;
	}
}

gammaRateOutput = parseInt(gammaRate.join(''), 2);
epsilonRateOutput = parseInt(epsilonRate.join(''), 2);

let answer = gammaRateOutput * epsilonRateOutput;


console.log({
	gammaRate: gammaRateOutput,
	epsilonRate: epsilonRateOutput,
	answer
});


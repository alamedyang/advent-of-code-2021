const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

var splits = fileText.trim().split('\n');
// console.log(splits);

var parsedSplits = splits.map(function(line){
	return parseInt(line, 10);
})

// console.log(parsedSplits);

var answer = 0;

var windowSums = [];

for (let index = 2; index < parsedSplits.length; index++) {
	const current = parsedSplits[index];
	const currentButOne = parsedSplits[index-1];
	const currentButTwo = parsedSplits[index-2];
	const sum = current + currentButOne + currentButTwo;
	windowSums.push(sum);
}

console.log(windowSums);

for (let index = 1; index < windowSums.length; index++) {
	const current = windowSums[index];
	const previous = windowSums[index-1];
	if (current > previous) {
		answer += 1;
	}
}

console.log(answer);
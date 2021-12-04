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

for (let index = 1; index < parsedSplits.length; index++) {
	const current = parsedSplits[index];
	const previous = parsedSplits[index-1];
	if (current > previous) {
		answer += 1;
	}
}

console.log(answer);
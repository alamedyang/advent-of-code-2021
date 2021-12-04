const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')
const splits = fileText.trim().split('\n');

let x = 0;
let y = 0;
let aim = 0;

// console.log(splits);

const directionHandlers = {
	forward: function (distance) {
		x += distance;
		y += aim * distance;
	},
	backward: function (distance) {
		x -= distance;
		y -= aim * distance;
	},
	up: function (distance) { aim -= distance; },
	down: function (distance) { aim += distance; },
}


splits.forEach(function(line){
	const lineSplit = line.split(' ');
	const direction = lineSplit[0];
	const distance = parseInt(lineSplit[1], 10);
	// const handler = directionHandlers[direction](distance);
	// slightly more sanitary:
	const handler = directionHandlers[direction]
	if (!handler) {
		throw new Error(`Invalid direction: ${direction}`)
	} else {
		handler(distance);
	}
})

var answer = x * y;
console.log(answer);
// console.log({
// 	x,
// 	y,
// 	aim,
// 	answer,
// });

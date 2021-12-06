const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const lines = fileText.trim().replace(/\r/g,'').split('\n');
// array of lines:
// 0,9 -> 5,9
// etc
// console.log('lines[0]: ' + lines[0]);

let moves = [];
lines.forEach(function (line) {
	const newLine = line.replace(' -> ',',').split(',');
	moves.push(newLine);
})
// array of 4 numbers: [x1,y1,x2,y2]
// console.log('moves[0] = ' + moves[0]);

const isHorizOrVertLine = function (move) {
	let result = 'meh'
	if (move.length === 4) {
		const x1 = parseInt(move[0],10);
		const y1 = parseInt(move[1],10);
		const x2 = parseInt(move[2],10);
		const y2 = parseInt(move[3],10);
		if (x1 === x2 && y1 !== y2) {
			result = 'vert';
		}
		if (y1 === y2 && x1 !== x2) {
			result = 'horiz';
		}
	} else {
		result = 'Error: move.length (array) != 4';
	}
	return result;
};

// console.log('moves[0]: ' + moves[0]);
// console.log('isHorizOrVertLine(moves[0]): ' + isHorizOrVertLine(moves[0]));

// ESTABLISHING DEFAULT GAME STATE

let maxHeight = 0;
let maxWidth = 0;

moves.forEach(function (move) {
	maxWidth = Math.max(parseInt(move[0],10), maxWidth); // x1
	maxWidth = Math.max(parseInt(move[2],10), maxWidth); // x2
	maxHeight = Math.max(parseInt(move[1],10), maxHeight); // y1
	maxHeight = Math.max(parseInt(move[3],10), maxHeight); // y2
}) // getting the height and width of the board

let gameBoard = [];

for (let index = 0; index <= maxHeight; index++) {
	let newArray = [];
	for (let index = 0; index <= maxWidth; index++) {
		newArray.push('.');
	}
	gameBoard.push(newArray);
} // game board is array populated with '.'

const gameBoardToString = function (gameBoardArray) {
	let temp = [];
	gameBoardArray.forEach(function(line) {
		temp.push(line.join(''));
	})
	let gameBoardString = temp.join('\n');
	return gameBoardString;
};

const gameBoardToArray = function (gameBoardString) {
	let temp = gameBoardString.split('\n');
	let gameBoardArray = [];
	temp.forEach(function (line){
		gameBoardArray.push(line.split(''));
	})
	return gameBoardArray;
};

const gameBoardStatus = function () {
	console.log(gameBoardToString(gameBoard));
}

// const test = '.......1..\n..1....1..\n..1....1..\n.......1..\n.112111211\n..........\n..........\n..........\n..........\n222111....'
// const test2 = gameBoardToArray(test);

// test2.forEach(function(line) {
// 	console.log(line);
// })

// GAME STATE MANAGEMENT

const getIncrementedTileValue = function (oldNumber) {
	// console.log('(oldNumber.replace) oldNumber: ' + oldNumber);
	let parsedNumber = parseInt(oldNumber.replace('.','0'),10);
	let newNumber = parsedNumber += 1;
	return newNumber.toString();
};

const incrementTileByCoordinates = function (x,y) {
	// console.log('x, y: ' + x + ', ' + y);
	// console.log('old tile status: ' + gameBoard[x][y]);
	let newTileStatus = getIncrementedTileValue(gameBoard[x][y]);
	gameBoard[x][y] = newTileStatus;
	// console.log('new tile status: ' + gameBoard[x][y]);
};

// incrementTileByCoordinates(2,2);
// console.log(gameBoardToString(gameBoard));
// TEST: SUCCESS! Arbitrary tiles on the game board can be incremented

const incrementOrDecrement = function (a,b) {
	let result = 0;
	if (a < b) {
		result = 1
	}
	if (a > b) {
		result = -1
	}
	return result;
};

const drawLine = function (move) {
	const x1 = parseInt(move[0],10);
	const y1 = parseInt(move[1],10);
	const x2 = parseInt(move[2],10);
	const y2 = parseInt(move[3],10);
	const xDelta = incrementOrDecrement(x1,x2);
	const yDelta = incrementOrDecrement(y1,y2);
	// console.log('move: ' + move);
	// console.log('xDelta, yDelta: ' + xDelta + ', ' + yDelta);
	const xLineLength = Math.max(x1,x2) - Math.min(x1,x2);
	const yLineLength = Math.max(y1,y2) - Math.min(y1,y2);
	// console.log('xLineLength, yLineLength: ' + xLineLength + ', ' + yLineLength);
	const lineLength = Math.max(xLineLength, yLineLength);
	// console.log('lineLength: ' + lineLength);
	for (let index = 0; index <= lineLength; index++) {
		let x = x1 + (xDelta * index);
		let y = y1 + (yDelta * index);
		incrementTileByCoordinates(y,x); // WHY IS IT BACKWARDS THOUGH
		// console.log('x, y: ' + x + ', ' + y);
	}
	// gameBoardStatus();
};

// const drawHorizOrVertLine = function (move) {
// 	// console.log(move);
// 	let typeOfMove = isHorizOrVertLine(move);
// 	const x1 = parseInt(move[0],10);
// 	const y1 = parseInt(move[1],10);
// 	const x2 = parseInt(move[2],10);
// 	const y2 = parseInt(move[3],10);
// 	if (typeOfMove === 'vert') { // Y changes @ move[4] = y1: 0, y2: 4
// 		const origin = parseInt(Math.min(y1,y2),10); // 0
// 		const endPoint = parseInt(Math.max(y1,y2),10); // 4
// 		const lineLength = endPoint - origin; // 4
// 		for (let index = origin; index <= endPoint; index++) {
// 			incrementTileByCoordinates(index,x1);
// 		}
// 	}
// 	if (typeOfMove === 'horiz') { // X changes
// 		const origin = Math.min(x1,x2);
// 		const endPoint = Math.max(x1,x2);
// 		const lineLength = endPoint - origin;
// 		for (let index = origin; index <= endPoint; index++) {
// 			incrementTileByCoordinates(y1,index);
// 		}
// 	}
// };

// console.log('moves[4] = ' + moves[4])
// drawHorizOrVertLine(moves[4]);
// gameBoardStatus();
// TEST: SUCCESS! Drawing lines works

// RUNNING THE GAME

console.log(
	'Game board size: maxWidth ' + maxWidth
	+ ', maxHeight ' + maxHeight
);

moves.forEach(function (move, index) {
	drawLine(move);
})

gameBoardStatus();

// LANA! LANA!!!

let dangerPoints = function () {
	let tally = 0;
	gameBoard.forEach(function (line) {
		line.forEach(function (point) {
			if (parseInt(point,10) > 1) {
				tally = tally += 1;
			}
		})
	})
	return tally;
};

console.log('dangerPoints: ' + dangerPoints());
const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME INPUT

const inputHalves = fileText.trim().split('\n\n');

let mapMaxHeight = 0;
let mapMaxWidth = 0;
// max height/width are the max coord value, not the actual size! (+1!!)

const lines = inputHalves[0].split('\n');
const dotCoords = [];
lines.forEach(function (line) {
	const coords = line.split(',');
	mapMaxWidth = Math.max(coords[0],mapMaxWidth);
	mapMaxHeight = Math.max(coords[1],mapMaxHeight);
	dotCoords.push(coords);
})

const foldsRaw = inputHalves[1].split('\n');
const folds = [];
foldsRaw.forEach(function (fold) {
	folds.push(fold.replace('fold along ','').split('='));
})

// MAKING THE DOT MAP GRID

let gameMap = [];
let blankLine = [];

for (let index = 0; index <= mapMaxHeight; index++) {
	let line = [];
	for (let index = 0; index <= mapMaxWidth; index++) {
		line.push('.');
	}
	gameMap.push(line);
}

for (let index = 0; index <= mapMaxWidth; index++) {
	blankLine.push('.');
} // lazzyyyyyyy

const logMapState = function (map) {
	let displayLines = [];
	let display = '';
	map.forEach(function (line) {
		displayLines.push(line.join(''));
	})
	displayLines.forEach(function (line) {
		display += line + '\n';
	})
	console.log(display)
	return display;
}

// GAME STUFF

const getValueAtCoordinate = function (array, _map) { // [x,y]
	const map = _map || gameMap;
	const x = array[0];
	const y = array[1];
	return (map[y] || [])[x];
};

const setValueAtCoordinate = function (array, value, _map) { // [x,y], 4
	const map = _map || gameMap;
	const x = array[0];
	const y = array[1];
	map[y][x] = value;
};

dotCoords.forEach(function (dotCoord) {
	const x = dotCoord[0];
	const y = dotCoord[1];
	setValueAtCoordinate([x,y],'#')
}) // INITIAL GAME STATE

const getUpdatedValue = function (valueA, valueB) {
	let result = '.';
	if (valueA === '#' || valueB === '#') {
		result = "#";
	}
	return result;
};

// FOLDS HO BOY WHEEEE

const foldMap = function (foldArray) {
	let axis = foldArray[0];
	let linePosition = foldArray[1];
	if (axis === 'x') {
		horizontalFold(linePosition);
	} else if (axis === 'y') {
		verticalFold(linePosition);
	} else {
		console.error('Not folding on the X or Y axis!! You dun goofed!')
	}
};

const horizontalReverse = function (map) {
	const reversedMapFragment = [];
	map.forEach(function (line) {
		reversedMapFragment.push(line.reverse());
	})
	return reversedMapFragment;
};
const horizontalReverseLine = function (line) {
	reversedLineFragment = line.reverse();
	return reversedLineFragment;
};

const verticalReverse = function (map) {
	reversedMapFragment = map.reverse();
	return reversedMapFragment;
};

const reconcileFolds = function (mapA, mapB) {
	newMap = [];
	mapA.forEach(function (line, yValue) {
		newLine = [];
		line.forEach(function (aDot, xValue) {
			const bDot = getValueAtCoordinate([xValue,yValue],mapB);
			newLine.push(getUpdatedValue(aDot,bDot));
		})
		newMap.push(newLine);
	})
	// console.log(newMap);
	return newMap;
}

const reconcileFoldsLine = function (lineA, lineB) {
	newLine = [];
	lineA.forEach(function (aDot, xValue) {
		const bDot = lineB[xValue];
		newLine.push(getUpdatedValue(aDot,bDot));
	})
	// console.log(newMap);
	return newLine;
}

const verticalFold = function (value) {
	mapFragment = gameMap.splice(value);
	mapFragment.shift(); // don't forget to remove the line on the "fold"!
	const origSize = gameMap.length;
	const fragmentSize = mapFragment.length;
	let newMap;
	if (fragmentSize > origSize) {
		const difference = fragmentSize - origSize;
		for (let index = 0; index < difference; index++) {
			gameMap.unshift(blankLine);
		}
	} else if (fragmentSize < origSize) {
		const difference = fragmentSize - origSize;
		for (let index = 0; index < difference; index++) {
			mapFragment.push(blankLine);
		}
	}
	reversedMapFragment = verticalReverse(mapFragment);
	newMap = reconcileFolds(gameMap, reversedMapFragment)
	gameMap = newMap;
};

const horizontalFold = function (value) {
	newMap = [];
	gameMap.forEach(function (line, yValue) {
		lineFragment = line.splice(value);
		lineFragment.shift(); // don't forget to remove the line on the "fold"!
		const origSize = line.length;
		const fragmentSize = lineFragment.length;
		if (fragmentSize > origSize) {
			const difference = fragmentSize - origSize;
			for (let index = 0; index < difference; index++) {
				line.unshift('.');
			}
		} else if (fragmentSize < origSize) {
			const difference = fragmentSize - origSize;
			for (let index = 0; index < difference; index++) {
				mapFragment.push('.');
			}
		}
		reversedLineFragment = horizontalReverseLine(lineFragment);
		const newLine = reconcileFoldsLine(line, reversedLineFragment);
		newMap.push(newLine);
	})
	gameMap = newMap;
};

let poundTally = 0;

const countDots = function () {
	gameMap.forEach (function (line) {
		line.forEach (function (dot) {
			if (dot === "#") {
				poundTally += 1;
			}
		})
	})
	console.log(poundTally);
	return poundTally;
}

// RUN GAME

// verticalFold(7);
// horizontalFold(5);

// foldMap(folds[0]);

folds.forEach(function (foldInstruction) {
	foldMap(foldInstruction);
})

logMapState(gameMap);

// countDots(); // 95 is incorrect: READ THE INSTRUCTIONS!

// console.log("breakpoint plz")
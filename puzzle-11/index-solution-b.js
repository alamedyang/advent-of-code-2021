const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

// PREPARING GAME BOARD(S)

const lines = fileText.trim().split('\n');
let gameMapLines = [];
lines.forEach(function (line) {
	gameMapLines.push(line.split(''));
})
let gameMap = []; // finished input
gameMapLines.forEach (function (line) {
	let lineArray = [];
	line.forEach(function (stringNumber) {
		let realNumber = parseInt(stringNumber,10);
		lineArray.push(realNumber);
	})
	gameMap.push(lineArray);
})

let mapMaxHeight = gameMap.length;
let mapMaxWidth = gameMap[0].length;

let flashMap = [];

for (let index = 0; index < mapMaxHeight; index++) {
	let line = [];
	for (let index = 0; index < mapMaxWidth; index++) {
		line.push('.');
	}
	flashMap.push(line);
}
// MAP META

const findValidNeighborCoordinates = function (array) { // give it [x,y]
	const x = array[0];
	const y = array[1];
	let neighborCoords = {};
	if (y-1 >= 0) {
		neighborCoords['north'] = [x,y-1];
	}
	if (y-1 >= 0 && x-1 >= 0) {
		neighborCoords['northwest'] = [x-1,y-1];
	}
	if (x-1 >= 0) {
		neighborCoords['west'] = [x-1,y];
	}
	if (x-1 >= 0 && y+1 < mapMaxHeight) {
		neighborCoords['southwest'] = [x-1,y+1];
	}
	if (y+1 < mapMaxHeight) {
		neighborCoords['south'] = [x,y+1];
	}
	if (y+1 < mapMaxHeight && x+1 < mapMaxWidth) {
		neighborCoords['southeast'] = [x+1,y+1];
	}
	if (x+1 < mapMaxWidth) {
		neighborCoords['east'] = [x+1,y];
	}
	if (x+1 < mapMaxWidth && y-1 >= 0) {
		neighborCoords['northeast'] = [x+1,y-1];
	}
	// console.log(JSON.stringify(neighborCoords))
	return neighborCoords;
};

// MAP I/O

const getOctopusValueAtCoordinate = function (array) { // [x,y]
	const x = array[0];
	const y = array[1];
	return (gameMap[y] || [])[x];
};

const getFlashValueAtCoordinate = function (array) { // [x,y]
	const x = array[0];
	const y = array[1];
	return (flashMap[y] || [])[x];
};

const setOctopusValueAtCoordinate = function (array, value) { // [x,y], 4
	const x = array[0];
	const y = array[1];
	gameMap[y][x] = value;
};

const setFlashValueAtCoordinate = function (array, value) { // [x,y], 4
	const x = array[0];
	const y = array[1];
	flashMap[y][x] = value;
};

let flashCount = 0;

const resetFlashMap = function () {
	flashMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			if (value === 'f') {
				flashCount += 1;
			}
			setFlashValueAtCoordinate([xIndex,yIndex],'.')
		})
	})

	// flashMap.forEach(function (line) {
	// 	line.fill('.');
	// })
}

const logGameState = function (map) {
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

// logGameState(gameMap)
// logGameState(flashMap)

// // GAME LOGIC

const incrementOctopusAtCoord = function (array) { // [x,y]
	let value = getOctopusValueAtCoordinate(array);
	let flashStatus = getFlashValueAtCoordinate(array);
	if (flashStatus === '.' ) {
		value += 1;
	}
	if (value === 10) {
		value = 0;
		if (getFlashValueAtCoordinate(array) === '.') {
			setFlashValueAtCoordinate(array, 'F')
		}
	}
	setOctopusValueAtCoordinate(array,value)
}

const calculateFlashes = function () {
	gameMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			if (value >= 10) {
				if (getFlashValueAtCoordinate([xIndex,yIndex]) === '.') {
					setFlashValueAtCoordinate([xIndex,yIndex], 'F')
				}
			}
		})
	})
}

const perpetuateFlashes = function () {
	flashMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			if (value === 'F') {
				const neighbors = findValidNeighborCoordinates([xIndex,yIndex]);
				Object.values(neighbors).forEach (function (neighbor) {
					const neighborFlash = getFlashValueAtCoordinate(neighbor);
					incrementOctopusAtCoord(neighbor);
				})
				setFlashValueAtCoordinate([xIndex,yIndex], 'f');
			}
		})
	})
}

const gameTick = function () {
	gameMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			incrementOctopusAtCoord([xIndex,yIndex])
		})
	})
	gameMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			calculateFlashes([xIndex,yIndex])
		})
	})
	gameMap.forEach(function (line, yIndex) {
		line.forEach(function (value, xIndex) {
			perpetuateFlashes([xIndex,yIndex])
		})
	})
	// while (logGameState(flashMap).includes('F')) {
	// 	logGameState(flashMap);
	// 	logGameState(gameMap);
	// 	flashMap.forEach(function (line, yIndex) {
	// 		line.forEach(function (value, xIndex) {


	// 		})
	// 	})
	// 	resetFlashMap
	// }
}

let allFlashesLine = ''
let allFlashes = ''

for (let index = 0; index < mapMaxWidth; index++) {
	allFlashesLine += 'f'
}

for (let index = 0; index < mapMaxHeight; index++) {
	allFlashes += allFlashesLine + "\n"
}

let finalTurn = 0;

let steps = 10000;

for (let index = 0; index < steps; index++) {
	gameTick();
	if (allFlashes === logGameState(flashMap)) {
		finalTurn = index + 1; // off by one? add one!
		break
	}
	resetFlashMap();
}

console.log('steps: ' + steps);
console.log('flashes: ' + flashCount);
console.log('brighest turn: ' + finalTurn);
logGameState(gameMap);

const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME BOARD

const incrementValue = function (oldNum) {
	let newNum = parseInt(oldNum,10) + 1;
	if (newNum === 10) {
		newNum = 1;
	}
	return newNum;
};

const incrementLine = function (array) {
	let newLine = array.map(function (number) {
		return incrementValue(number);
	})
	return newLine;
}

const incrementBlock = function (arrays) {
	let newArrays = [];
	arrays.forEach(function (line) {
		let newLine = incrementLine(line);
		newArrays.push(newLine);
	})
	return newArrays;
}

const lines = fileText.trim().split('\n');

const gameMap = lines.map(function (line) {
	return line.split('')
});

let newGameMap = [];

gameMap.forEach(function (line) {
	let newLine = line.slice();
	newLine = newLine.concat(incrementLine(line));
	newLine = newLine.concat(incrementLine(incrementLine(line)));
	newLine = newLine.concat(incrementLine(incrementLine(incrementLine(line))));
	newLine = newLine.concat(incrementLine(incrementLine(incrementLine(incrementLine(line)))));
	newLine = newGameMap.push(newLine);
})

let cacheLines = JSON.parse(JSON.stringify(newGameMap)); // deep clone
cacheLines = incrementBlock(cacheLines);
newGameMap = newGameMap.concat(JSON.parse(JSON.stringify(cacheLines)));
cacheLines = incrementBlock(cacheLines);
newGameMap = newGameMap.concat(JSON.parse(JSON.stringify(cacheLines)));
cacheLines = incrementBlock(cacheLines);
newGameMap = newGameMap.concat(JSON.parse(JSON.stringify(cacheLines)));
cacheLines = incrementBlock(cacheLines);
newGameMap = newGameMap.concat(JSON.parse(JSON.stringify(cacheLines)));

// THIS IS BAD AND I SHOULD FEEL BAD
// BUT IT'S LIKE REALLY LATE AND I'M SO TIRED

// console.log(newGameMap);


// PREPARING LARGER GAME BOARD ABOVE ^^

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

let mapMaxHeight = newGameMap.length;
let mapMaxWidth = newGameMap[0].length;
let endCoord = [mapMaxWidth-1,mapMaxHeight-1]

let pathMap = [];

for (let index = 0; index < mapMaxHeight; index++) {
	let line = [];
	for (let index = 0; index < mapMaxWidth; index++) {
		line.push('.');
	}
	pathMap.push(line);
}

// logMapState(pathMap);

// GAME BOARD META

const findValidNeighborCoordinates = function (array) {
	const x = array[0];
	const y = array[1];
	let neighborCoords = {};
	if (y-1 >= 0) {
		neighborCoords['north'] = [x,y-1];
	}
	if (y+1 < mapMaxHeight) {
		neighborCoords['south'] = [x,y+1];
	}
	if (x-1 >= 0) {
		neighborCoords['east'] = [x-1,y];
	}
	if (x+1 < mapMaxWidth) {
		neighborCoords['west'] = [x+1,y];
	}
	return neighborCoords;
};

const getValueAtCoordinate = function (array, _map) { // [x,y]
	const map = _map || newGameMap;
	const x = array[0];
	const y = array[1];
	return (map[y] || [])[x];
};

const setValueAtCoordinate = function (array, value, _map) { // [x,y], 4
	const map = _map || newGameMap;
	const x = array[0];
	const y = array[1];
	map[y][x] = value;
};

// GAME SPECIFIC META

const getPathDangerValue = function (path) {
	let total = 0 - getValueAtCoordinate([0,0]);
	path.forEach(function (coord) {
		total += parseInt(getValueAtCoordinate(coord),10);
	})
	return total;
};

const distanceToExit = function (path) {
	const lastCoord = path[path.length-1];
	const x = lastCoord[0];
	const y = lastCoord[1];
	return (mapMaxWidth - x) + (mapMaxHeight - y);
};

const plotPath = function (pathArray) {
	let result = pathMap.slice(); // shallow clone?
	pathArray.forEach(function (coord) {
		setValueAtCoordinate(coord,'X',result)
	})
	logMapState(result);
	return result;
};

const getMinOfNeighbors = function (coord) {
	const neighbors = findValidNeighborCoordinates(coord);
	let currentMin = Infinity;
	Object.values(neighbors).forEach(function (neighborCoord) {
		const rawNeighborValue = getValueAtCoordinate(neighborCoord, experimentMap);
		let neighborValue = Infinity;
		if (rawNeighborValue !== '.') {
			neighborValue = parseInt(rawNeighborValue,10);
		}
		currentMin = Math.min(neighborValue,currentMin);
	})
	return currentMin;
};

// SECOND VERSION



logMapState(newGameMap);

let experimentMap = JSON.parse(JSON.stringify(pathMap));
let bestPath = [];

const isValidCoordinate = function (coord) {
	if (getValueAtCoordinate(coord)) {
		return true;
	} else {
		return false;
	}
}

setValueAtCoordinate([0,0],0,experimentMap);

for (let index = 1; index < (mapMaxHeight+mapMaxWidth); index++) {
	let counter = index;
	while (counter >= 0) {
		const coord = [counter, (index - counter)];
		if (isValidCoordinate(coord)) {
			const value = parseInt(getMinOfNeighbors(coord),10) + parseInt(getValueAtCoordinate(coord),10);
			setValueAtCoordinate(coord,value,experimentMap);
		}
		counter -= 1;
	}
}

let answerCoord = [(mapMaxWidth-1),(mapMaxHeight-1)];

const optimizeMap = function () {
	experimentMap.forEach(function (line, yIndex) {
		line.forEach(function (number, xIndex) {
			const coord = [xIndex,yIndex];
			const value = parseInt(getMinOfNeighbors(coord),10) + parseInt(getValueAtCoordinate(coord),10);
			setValueAtCoordinate(coord,value,experimentMap);
		})
	})
	return getValueAtCoordinate(answerCoord, experimentMap);
}


while (getValueAtCoordinate(answerCoord, experimentMap) != optimizeMap()) {
	optimizeMap();
	console.log(getValueAtCoordinate(answerCoord, experimentMap));
}


// console.log(experimentMap);

let answer = getValueAtCoordinate(answerCoord, experimentMap);

console.log(answer); // 2935 is too highhhhhhh

console.log('breakpoint me');
const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME BOARD

const lines = fileText.trim().split('\n');
const gameMap = lines.map(function (line) {
	return line.split('')
});

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

let mapMaxHeight = gameMap.length;
let mapMaxWidth = gameMap[0].length;
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

const runGame = function (startCoord) {
	let start = startCoord || [0,0];

};

console.log(experimentMap);

let answer = [(mapMaxWidth-1),(mapMaxHeight-1)];

console.log(getValueAtCoordinate(answer, experimentMap))

console.log('breakpoint me');
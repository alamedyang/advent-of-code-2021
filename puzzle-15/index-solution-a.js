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

const checkValidDestination = function (coord, path) {
	const stringifiedArray = path.map(function (coord) {
		return coord.join(',');
	});
	const testCoord = coord.join(',');
	let result = null;
	if (stringifiedArray.includes(testCoord)) {
		result = false;
	} else {
		result = true;
	}
	return result;
}
const getPathDangerValue = function (path) {
	let total = 0 - getValueAtCoordinate([0,0]);
	path.forEach(function (coord) {
		total += parseInt(getValueAtCoordinate(coord),10);
	})
	return total;
}

let pathsFound = [
	[
		[0,0] // one coord on a path
	],
];
let finalPaths = [];

const gameTic = function () {
	let newPathsFound = []; // gonna overwrite pathsFound when this is done
	pathsFound.forEach(function (pathArray){ // for each current path
		let coord = pathArray[pathArray.length-1]; // get the last coordinate
		let possibilities = findValidNeighborCoordinates(coord);
		Object.values(possibilities).forEach(function (possibleDestination) {
			let growingPath = pathArray.slice(); // temporary new path (shallow clone)
			growingPath.push(possibleDestination); // add potential destination
			if (possibleDestination.join(',') === endCoord.join(',')) {
				finalPaths.push(growingPath);
			} else {
				if (checkValidDestination(possibleDestination, pathArray)) {
					newPathsFound.push(growingPath);
				}
			}
		})
	})
	pathsFound = newPathsFound;
	// console.log(pathsFound);
}

const distanceToExit = function (path) {
	const lastCoord = path[path.length-1];
	const x = lastCoord[0];
	const y = lastCoord[1];
	return (mapMaxWidth - x) + (mapMaxHeight - y);
}

const cullPaths = function (pathArray) {
	let dangerMap = pathArray.map(function (path) {
		return getPathDangerValue(path);
	})
	const maxDanger = Math.max(...dangerMap);
	const minDanger = Math.min(...dangerMap);
	const distanceArray = pathArray.map(function (path) {
		return distanceToExit(path);
	})
	const bestDistanceLeft = Math.min(...distanceArray);
	const worstDistanceLeft = Math.max(...distanceArray);
	const middlingDistanceLeft = (bestDistanceLeft + worstDistanceLeft) / 2;
	const dangerAverage = (maxDanger + minDanger) / 2
	let culledPaths = [];
	pathArray.forEach(function (path) {
		if (
			getPathDangerValue(path) < dangerAverage &&
			distanceToExit(path) < middlingDistanceLeft
		) {
			culledPaths.push(path)
		}
	})
	return culledPaths;
}

const plotPath = function (pathArray) {
	let result = pathMap.slice(); // shallow clone?
	pathArray.forEach(function (coord) {
		setValueAtCoordinate(coord,'X',result)
	})
	logMapState(result);
	return result;
}

for (let index = 0; index < 100000 && pathsFound.length; index++) {
	gameTic(pathsFound);
	console.log('paths found: ' + pathsFound.length);
	while (pathsFound.length > 40000) {
		pathsFound = cullPaths(pathsFound);
		console.log('paths culled to ' + pathsFound.length);
	}	
}
console.log('paths that made the grade: ' + finalPaths.length)

const getWinningPath = function () {
	const finalScores = finalPaths.map(function (path) {
		return getPathDangerValue(path);
	})
	const winningPathScore = Math.min(...finalScores);
	console.log('lowest danger: ' + winningPathScore);
	const winningIndex = finalScores.indexOf(winningPathScore);
	plotPath(finalPaths[winningIndex]);
}

getWinningPath();

// plotPath(pathsFound[0]);
// plotPath(pathsFound[10]);
// plotPath(pathsFound[20]);
// plotPath(pathsFound[30]);
// plotPath(pathsFound[40]);


// let testAnswer = [
// 	[0,0],
// 	[0,1],
// 	[0,2],
// 	[1,2],
// 	[2,2],
// 	[3,2],
// 	[4,2],
// 	[5,2],
// 	[6,2],
// 	[6,3],
// 	[7,3],
// 	[7,4],
// 	[7,5],
// 	[8,5],
// 	[8,6],
// 	[8,7],
// 	[8,8],
// 	[9,8],
// 	[9,9],
// ];
// plotPath(testAnswer);
// console.log(getPathDangerValue(testAnswer))


console.log('breakpoint me');
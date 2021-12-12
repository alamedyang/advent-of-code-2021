const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

// PREPARING PATHS

const lines = fileText.trim().split('\n');

let starts = [];
let ends = [];
let paths = {};
lines.forEach(function (line) {
	const newLine = line.split('-');
	starts.push(newLine[0]);
	ends.push(newLine[1]);
})
starts.forEach(function (start, index) {
	const end = ends[index];
	paths[start] = paths[start] || []
	paths[start].push(end);
})
ends.forEach(function (end, index) {
	const start = starts[index];
	paths[end] = paths[end] || []
	if (!paths[end].includes(start)) {
		paths[end].push(start);
	}
})

// GAME META

const detectLowerCase = function (character) {
	const value = character.charCodeAt(0);
	let result = null;
	if (value > 91) { result = true; } else { result = false; }
	// console.log(result);
	return result;
};

const detectDuplicates = function (pathToNow, targetPosition) {
	let result = true;
	let lastIndex = pathToNow.lastIndexOf(targetPosition);
	let firstIndex = pathToNow.indexOf(targetPosition);
	if (lastIndex === -1) {
		result = false;
	} else if (lastIndex === firstIndex) {
		result = false;
	}
	return result;
}

const findDuplicateSmallCave = function (pathToNow) {
	let duplicate = null;
	pathToNow.forEach(function (vertex) {
		if (detectDuplicates(pathToNow,vertex) && detectLowerCase(vertex)) {
			duplicate = vertex;
		}
	})
	return duplicate;
}

const checkValidMovement = function (pathToNow, targetPosition) {
	let result = undefined;
	if (pathToNow[0] === null) {
		result = true;
	} else {
		if (
			pathToNow.includes(targetPosition) // we've been there before
			&& detectLowerCase(targetPosition) // cave is lower case
		) {
			result = false;
		} else {
			result = true
		};
	}
	return result;
};

// GAME CYCLE

let pathsFound = [
	[null,'start'],
];

let finalPaths = []

const findPaths = function () {
	let newPathsFound = []; // gonna overwrite pathsFound when this is done
	pathsFound.forEach(function (pathArray){ // for each current path
		let lastVertex = pathArray[pathArray.length-1]; // get the last position
		paths[lastVertex].forEach(function (possibleDestination) {
			if (
				lastVertex !== 'end' // if the last vertex isn't end
				&& possibleDestination !== 'start' // AND if the potential destination isn't START
				&& checkValidMovement(pathArray,possibleDestination) // AND it's not an invalid small cave
			) {
				let growingPath = pathArray.slice(); // temporary new path (shallow clone)
				growingPath.push(possibleDestination); // add potential destination
				if (possibleDestination === 'end') {
					finalPaths.push(growingPath); // END OF LINE
				} else {
					if (growingPath[0] === null && findDuplicateSmallCave(growingPath)) {
						growingPath[0] = findDuplicateSmallCave(growingPath);
					}
					newPathsFound.push(growingPath);
				}
			}
		})
	})
	pathsFound = newPathsFound;
	console.log(pathsFound);
}

findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();
findPaths();

// console.log(JSON.stringify(pathsFound, null, '    '))

console.log(finalPaths)

console.log(finalPaths.length)

console.log('huh')
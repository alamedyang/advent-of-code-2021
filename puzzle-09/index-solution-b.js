const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

// PREPARING INPUT

const lines = fileText.trim().split('\n');
let heightMap = [];
lines.forEach(function (line) {
	heightMap.push(line.split(''));
})
let numberHeightMap = []; // finished input
heightMap.forEach (function (line) {
	let lineArray = [];
	line.forEach(function (stringNumber) {
		let realNumber = parseInt(stringNumber,10);
		lineArray.push(realNumber);
	})
	numberHeightMap.push(lineArray);
})

// FINDING LOW SPOTS

const findValueAtCoordinate = function (array) { // [x,y]
	const x = array[0];
	const y = array[1];
	return (numberHeightMap[y] || [])[x]; // single number
};

let mapMaxHeight = numberHeightMap.length;
let mapMaxWidth = numberHeightMap[0].length;

const findValidNeighborCoordinates = function (array) {
	const x = array[0];
	const y = array[1];
	let neighborCoords = {};
	if (y-1 >= 0) {
		neighborCoords['north'] = [x,y-1];
	}
	if (y+1 <= mapMaxHeight) {
		neighborCoords['south'] = [x,y+1];
	}
	if (x-1 >= 0) {
		neighborCoords['east'] = [x-1,y];
	}
	if (x+1 <= mapMaxWidth) {
		neighborCoords['west'] = [x+1,y];
	}
	// let neighborCoords = {
	// 	north:(y-1 >= 0) ? [x,y-1] : null,
	// 	south:(y+1 <= mapMaxHeight) ? [x,y+1] : null,
	// 	east:(x-1 >= 0) ? [x-1,y] : null,
	// 	west:(x+1 <= mapMaxWidth) ? [x+1,1] : null,
	// };
	return neighborCoords;
};

// let test = findValidNeighborCoordinates([1,3])

// console.log('north: ' + test['north'] + ' -- value: ' + findValueAtCoordinate(test['north']));
// console.log('south: ' + test['south'] + ' -- value: ' + findValueAtCoordinate(test['south']));
// console.log('east: ' + test['east'] + ' -- value: ' + findValueAtCoordinate(test['east']));
// console.log('west: ' + test['west'] + ' -- value: ' + findValueAtCoordinate(test['west']));

let safetyMap = [];

numberHeightMap.forEach (function (line, yIndex) {
	let safetyLine = [];
	line.forEach (function (number, xIndex) {
		let neighborCoords = findValidNeighborCoordinates([xIndex,yIndex]);

		let safetyValue = [xIndex, yIndex];
		Object.values(neighborCoords).forEach(function (neighbor) {
			const neighborValue = findValueAtCoordinate(neighbor)
			if (neighborValue !== null && neighborValue !== undefined) {
				// console.log(
				// 	'coordinate: ' + xIndex+ ', ' + yIndex + ' -- ' +
				// 	'neighbor: ' + neighbor + ' -- '
				// 	+ number + ' >= '
				// 	+ neighborValue + ' ('
				// 	+ (number >= neighborValue) + ')'
				// 	)
				if (number >= neighborValue) {
					safetyValue = null;
				}
			}
		})
		safetyLine.push(safetyValue);
	})
	safetyMap.push(safetyLine);
})

console.log(safetyMap[0])
console.log(safetyMap[1])
console.log(safetyMap[2])
console.log(safetyMap[3])
console.log(safetyMap[4])

let basinMap = JSON.parse(JSON.stringify(safetyMap));

const contagion = function () {
	basinMap.forEach(function (line, yIndex) {
		line.forEach (function (number, xIndex) {
			const value = findValueAtCoordinate([xIndex,yIndex]);
			// console.log(`number: ${number} -- x,y ${xIndex},${yIndex} -- value: ${value}`)
			if (number !== null) {
				// console.log((number === null) + ' -- value: ' + value)
				const neighborCoords = findValidNeighborCoordinates([xIndex,yIndex]); // array of coordArrays
				Object.values(neighborCoords).forEach(function (neighbor) {
					let neighborValue = findValueAtCoordinate(neighbor);
					if (neighborValue > value && neighborValue !== 9) {
						let neighborX = neighbor[0];
						let neighborY = neighbor[1];
						// console.log(basinMap[yIndex][xIndex]);
						// console.log(basinMap[neighborY][neighborX] + ' becomes ' + basinMap[yIndex][xIndex]);
						basinMap[neighborY][neighborX] = basinMap[yIndex][xIndex];
					}
				})
				
			}
		})
	})
	// console.log(basinMap[0]);
	// console.log(basinMap[1]);
	// console.log(basinMap[2]);
	// console.log(basinMap[3]);
	// console.log(basinMap[4]);
}

for (let index = 0; index < 10; index++) {
	contagion();
}

let valueCount = {
};

basinMap.forEach(function (line) {
	line.forEach(function (value) {
		if (value !== null) {
			// console.log(value.join('|'));
			valueCount[value.join('|')] = 1 + (valueCount[value.join('|')] || 0);
		}
	})
})

console.log(valueCount);
const sortNumbers = function (a,b) {
	return a-b;
}

let finalCounts = Object.values(valueCount).sort(sortNumbers).reverse();


console.log(finalCounts)

let finalProduct = finalCounts[0] * finalCounts[1] * finalCounts[2];

console.log(finalProduct)

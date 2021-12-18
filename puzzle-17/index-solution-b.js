const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME BOARD

const splits = fileText.trim().replace('target area: ','').split(', ');
const xRange = splits[0].replace('x=','').split('..');
const yRange = splits[1].replace('y=','').split('..');

const probePhysics = function (probeObject) {
	let xCoord = probeObject.coord[0];
	let yCoord = probeObject.coord[1];
	let xVel = probeObject.vel[0];
	let yVel = probeObject.vel[1];
	let newXCoord = xCoord + xVel;
	let newYCoord = yCoord + yVel;
	if (xVel > 0) {
		xVel -= 1;
	} else if (xVel < 0) {
		xVel += 1;
	}
	yVel -= 1;
	return {
		coord: [newXCoord,newYCoord],
		vel: [xVel,yVel]
	}
};

const box = [xRange, yRange];

const testIfInsideBox = function (x,y,whichBox) {
	const targetBox = whichBox || box;
	let xRange = targetBox[0];
	let yRange = targetBox[1];
	let result = false;
	if (
		x >= parseInt(xRange[0],10) && x <= parseInt(xRange[1],10)
		&& y >= (parseInt(yRange[0],10)) && y <= parseInt(yRange[1],10)
	) { result = true; }
	return result;
};

// LOGGING THE MAP

const plotProbeLog = function (probeLog, whichBox) {
	const targetBox = whichBox || box;
	const boxMinX = parseInt(targetBox[0][0],10);
	const boxMaxX = parseInt(targetBox[0][1],10);
	const boxMinY = parseInt(targetBox[1][0],10);
	const boxMaxY = parseInt(targetBox[1][1],10);
	let mapMinX = 0;
	let mapMaxX = boxMaxX;
	let mapMinY = boxMinY;
	let mapMaxY = boxMaxY;
	probeLog.forEach(function (log) {
		let logX = log.coord[0];
		let logY = log.coord[1];
		mapMaxX = Math.max(mapMaxX, logX);
		mapMinY = Math.min(mapMinY, logY);
		mapMaxY = Math.max(mapMaxY, logY);
	})
	let mapHeight = mapMaxY - mapMinY;
	let mapWidth = mapMaxX - mapMinX;
	let map = [];
	let mapLine = [];
	mapLine.length = mapWidth + 1;
	mapLine = mapLine.fill('.');
	for (let index = 0; index <= mapHeight; index++) {
		map.push(mapLine.slice());
	}
	const setValueAtCoordinate = function (array, value) { // [x,y], 4
		const x = array[0] - mapMinX;
		const y = array[1] - mapMinY;
		map[y][x] = value;
	};
	const logMapState = function () {
		let displayLines = [];
		let display = '';
		map.forEach(function (line) {
			displayLines.push(line.join(''));
		})
		displayLines.reverse();
		displayLines.forEach(function (line) {
			display += line + '\n';
		})
		console.log(display);
	};
	for (let xIndex = mapMinX; xIndex <= mapMaxX; xIndex++) {
		for (let yIndex = mapMinY; yIndex <= mapMaxY; yIndex++) {
			if (testIfInsideBox(xIndex, yIndex, targetBox)) {
				setValueAtCoordinate([xIndex,yIndex], 'T');
			}
		}
	}
	probeLog.forEach(function (log) {
		let logX = log.coord[0];
		let logY = log.coord[1];
		setValueAtCoordinate([logX,logY], '#');
	})
	setValueAtCoordinate([0,0], 'S');
	logMapState();
}

// MEATY STUFF

let successfullyShotProbes = [];

const shootProbe = function (x,y,whichBox) {
	let targetBox = whichBox || box;
	let probeLog = [
		{ coord: [0,0], vel: [x,y] }
	];
	const getLatestX = function () {
		return probeLog[probeLog.length-1].coord[0];
	}
	const getLatestY = function () {
		return probeLog[probeLog.length-1].coord[1];
	}
	let latestX = getLatestX();
	let latestY = getLatestY();
	let success = false;
	const isProbeOutOfBounds = function () {
		return latestX <= parseInt(targetBox[0][1],10) && latestY >= parseInt(targetBox[1][0],10);
	}
	let keepGoing = isProbeOutOfBounds();
	while (keepGoing) {
		const newResult = probePhysics(probeLog[probeLog.length-1])
		probeLog.push(newResult);
		latestX = getLatestX();
		latestY = getLatestY();
		if (testIfInsideBox(latestX, latestY, targetBox)) {
			success = true;
			keepGoing = false;
		} else {
			keepGoing = isProbeOutOfBounds();
		}
	}
	// plotProbeLog(probeLog);
	// console.log(probeLog);
	// console.log('probe successful: ' + success); // can't catch if successful on first turn (PROBLEM? NAH)
	if (success) {
		successfullyShotProbes.push([x,y]);
	}
	return probeLog;
};

// ALGEBRA OR SOMTHGN

const findIdealXVelocity = function (xRange) {
	boxMinX = xRange[0];
	boxMaxX = xRange[1];
	let series = [0,1];
	while (series[series.length-1] <= boxMinX) {
		series.push(series.length + series[series.length-1]);
	}
	return (series.length-1);
}

// console.log(findIdealXVelocity(xRange));

// Whatever the findIdealXVelocity(xRange) is, that's how many turns you can take at minimum for sky-high Y
// It is also the X velocity verbatim (it can't decay any further past this; X vel will be 0 when done)

// console.log(findIdealXVelocity(xRange));

const minY = parseInt(yRange[0],10);
const maxY = Math.abs(parseInt(yRange[0],10));
const minX = parseInt(findIdealXVelocity(xRange),10);
const maxX = parseInt(xRange[1],10);

for (let yIndex = minY - 1; yIndex <= maxY + 1; yIndex++) {
	for (let xIndex = minX - 1 ; xIndex <= maxX + 1; xIndex++) {
		shootProbe(xIndex,yIndex);
	}
}

console.log(JSON.stringify(successfullyShotProbes)
	.replaceAll('],[','\n')
	.replace('[[','')
	.replace(']]',''));
console.log(successfullyShotProbes.length);

const testProbes = [
	[23,-10],[25,-9],[27,-5],[29,-6],[22,-6],[21,-7],[9,0],[27,-7],[24,-5],[25,-7],[26,-6],[25,-5],[6,8],[11,-2],[20,-5],[29,-10],[6,3],[28,-7],[8,0],[30,-6],[29,-8],[20,-10],[6,7],[6,4],[6,1],[14,-4],[21,-6],[26,-10],[7,-1],[7,7],[8,-1],[21,-9],[6,2],[20,-7],[30,-10],[14,-3],[20,-8],[13,-2],[7,3],[28,-8],[29,-9],[15,-3],[22,-5],[26,-8],[25,-8],[25,-6],[15,-4],[9,-2],[15,-2],[12,-2],[28,-9],[12,-3],[24,-6],[23,-7],[25,-10],[7,8],[11,-3],[26,-7],[7,1],[23,-9],[6,0],[22,-10],[27,-6],[8,1],[22,-8],[13,-4],[7,6],[28,-6],[11,-4],[12,-4],[26,-9],[7,4],[24,-10],[23,-8],[30,-8],[7,0],[9,-1],[10,-1],[26,-5],[22,-9],[6,5],[7,5],[23,-6],[28,-10],[10,-2],[11,-1],[20,-9],[14,-2],[29,-7],[13,-3],[23,-5],[24,-8],[27,-9],[30,-7],[28,-5],[21,-10],[7,9],[6,6],[21,-5],[27,-10],[7,2],[30,-9],[21,-8],[22,-7],[24,-9],[20,-6],[6,9],[29,-5],[8,-2],[27,-8],[30,-5],[24,-7]
];
const runTest = function (_testProbeLogs, _targetArray) {
	const targetArray = _targetArray || testProbes;
	const testProbeLogs = _testProbeLogs || successfullyShotProbes;
	console.log(testProbeLogs);
	const targetStrings = targetArray.map(function (coord) {
		return coord.join(',');
	})
	// console.log(targetStrings);
	const testStrings = Object.values(testProbeLogs).map(function (log) {
		const result = log.join(',');
		return result;
	})
	// console.log(testStrings);
	let missingProbes = [];
	targetStrings.forEach(function (coordString) {
		if (!testStrings.includes(coordString)) {
			missingProbes.push(coordString);
		}
	})
	let falsePositives = [];
	testStrings.forEach(function (coordString) {
		if (!targetStrings.includes(coordString)) {
			falsePositives.push(coordString);
		}
	})
	const result = {
		missingProbes,
		falsePositives
	}
	console.log('false positives:');
	console.log(falsePositives);
	console.log('probes that should have counted as SUCCESS but didn\'t:');
	console.log(missingProbes)
	console.log(''); // test probe count
	return result;
}
runTest();

// console.log(plotProbeLog(shootProbe(7,-1)));

console.log(successfullyShotProbes.length); // 1278 is too low

// const testLaunches = [
// 	[7,1],
// 	[6,1]
// ];

// testLaunches.forEach(function (array) {
// 	const x = array[0];
// 	const y = array[1];
// 	console.log(`Probe at: ${x}, ${y}`);
// 	shootProbe(x,y);
// })



console.log('break');
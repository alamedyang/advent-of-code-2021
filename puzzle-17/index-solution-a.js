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
		x >= xRange[0] && x <= xRange[1]
		&& y >= yRange[0] && y <= yRange[1]
	) { result = true; }
	return result;
};

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
	while (latestX < targetBox[0][1] && latestY > targetBox[1][1]) {
		const newResult = probePhysics(probeLog[probeLog.length-1])
		probeLog.push(newResult);
		latestX = getLatestX();
		latestY = getLatestY();
		if (testIfInsideBox(latestX, latestY, targetBox)) {
			success = true;
		}
	}
	console.log(probeLog);
	console.log('probe successful: ' + success); // can't catch if successful on first turn (PROBLEM? NAH)
	return probeLog;
};

// UTTERLY BROKEN, DON'T KNOW WHY -->
// const mapProbe = function (probeLog, whichBox) {
// 	const targetBox = whichBox || box;
// 	const boxMinX = parseInt(targetBox[0][0],10);
// 	const boxMaxX = parseInt(targetBox[0][1],10);
// 	const boxMinY = parseInt(targetBox[1][0],10);
// 	const boxMaxY = parseInt(targetBox[1][1],10);
// 	let mapMinX = 0;
// 	let mapMaxX = boxMaxX;
// 	let mapMinY = boxMinY;
// 	let mapMaxY = boxMaxY;
// 	probeLog.forEach(function (log) {
// 		let logX = log.coord[0];
// 		let logY = log.coord[1];
// 		mapMaxX = Math.max(mapMaxX, logX);
// 		mapMinY = Math.min(mapMinY, logY);
// 		mapMaxY = Math.max(mapMaxY, logY);
// 	})
// 	let mapHeight = mapMaxY - mapMinY;
// 	let mapWidth = mapMaxX - mapMinX;
// 	let map = [];
// 	let mapLine = [];
// 	mapLine.length = mapWidth;
// 	mapLine = mapLine.fill('.');
// 	for (let index = 0; index <= mapHeight; index++) {
// 		map.push(mapLine);
// 	}
// 	const setValueAtCoordinate = function (array, value) { // [x,y], 4
// 		const x = array[0] - mapMinX;
// 		const y = array[1] - mapMinY;
// 		map[y][x] = value;
// 	};
// 	const logMapState = function () {
// 		let displayLines = [];
// 		let display = '';
// 		map.forEach(function (line) {
// 			displayLines.push(line.join(''));
// 		})
// 		displayLines.forEach(function (line) {
// 			display += line + '\n';
// 		})
// 		console.log(display);
// 	};
// 	for (let xIndex = mapMinX; xIndex <= mapMaxX; xIndex++) {
// 		for (let yIndex = mapMinY; yIndex <= mapMaxY; yIndex++) {
// 			if (testIfInsideBox(xIndex, yIndex, targetBox)) {
// 				setValueAtCoordinate([xIndex,yIndex], 'T');
// 			}
// 			logMapState();
// 		}
// 	}
// 	probeLog.forEach(function (log) {
// 		let logX = log.coord[0];
// 		let logY = log.coord[1];
// 		setValueAtCoordinate([logX,logY], '#');
// 	})


// shootProbe(7,2); // should be TRUE
// shootProbe(6,3); // should be TRUE
// shootProbe(9,0); // should be TRUE
// shootProbe(17,-4); // should be FALSE

// TRYING ANOTHER APPROACH

const findIdealXVelocity = function (xRange) {
	boxMinX = xRange[0];
	boxMaxX = xRange[1];
	let series = [0,1];
	while (series[series.length-1] < boxMaxX) {
		series.push(series.length + series[series.length-1]);
	}
	return (series.length-2);
}

console.log(findIdealXVelocity(xRange));

// Whatever the findIdealXVelocity(xRange) is, that's how many turns you can take at minimum
// It is also the X velocity verbatim (it can't decay any further past this; X vel will be 0 when done)

// OLD VERSION:

const findIdealYVelocity = function (yRange) {
	boxMinY = yRange[0];
	boxMaxY = yRange[1];
	let series = [0,1];
	while (series[series.length-1] <= Math.abs(boxMinY)) {
		series.push(series.length + series[series.length-1]);
	}
	const result = series[series.length-2];
	return result;
}

// const findIdealYTurn = function (yRange) {
// 	boxMinY = yRange[0];
// 	// boxMaxY = yRange[1];
// 	// const boxHeight = boxMaxY - boxMinY;
// 	let series = [0];
// 	while (series[series.length-1] <= Math.abs(boxMinY)) {
// 		series.push(series.length + series[series.length-1]);
// 	}
// 	console.log({series, boxMinY})
// 	let interestingIndex = series.length-2;
// 	let result = interestingIndex *2 + 1;
// 	return result;
// }

const getHighY = function (probeLog) {
	let maxY = 0;
	probeLog.forEach(function (log) {
		let logY = log.coord[1];
		maxY = Math.max(maxY, logY);
	})
	return maxY;
};

const answerX = findIdealXVelocity(xRange);
const answerY = findIdealYVelocity(yRange);

console.log('target box: ' + xRange + ', ' + yRange);
console.log('answer? x,y: ' + answerX + ', ' + answerY); // y = 23 is WRONG // also 21, 22, 66, 276, 1540, 2211 // READ IT
shootProbe(answerX,answerY); // should be TRUE?
console.log(getHighY(shootProbe(answerX,72))); // all that matters is the value of the bottom of the target box??

// 2628 WAS RIGHT? ARE YOU KIDDING ME?
// YOU DON'T EVEN NEED TO DO ANY MATH?

//

console.log('break')
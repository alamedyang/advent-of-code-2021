const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const fishies = fileText.trim().split(',');

let days = [
	[0,0,0,0,0,0,0,0,0]
];

fishies.forEach(function(string){
	let daysIndex = parseInt(string,10);
	days[0][daysIndex] = days[0][daysIndex] + 1;
})

// console.log(days[0]);

// fishies is now an array where each index is the number of fish at that age

const getLastDay = function () {
	let lastDay = days.length - 1;
	return lastDay;
}

const getLastDayTotal = function () {
	const fishies = days[getLastDay()];
	let total = 0;
	fishies.forEach(function (fish) {
		total += fish;
	})
	return total;
}

// console.log(getLastDayTotal());

const incrementDay = function () {
	let newDayFishTally = [0,0,0,0,0,0,0,0,0];
	let oldDayFishTally = days[getLastDay()];
	oldDayFishTally.forEach(function (tally, index) {
		if (index === 0) {
			newDayFishTally[6] += tally;
			newDayFishTally[8] += tally;
		} else {
			newDayFishTally[index - 1] += tally;
		}
	})
	days.push(newDayFishTally);
};

const reportFishStatus = function () {
	const fishList = days[getLastDay()];
	const dayNumber = getLastDay();
	const totalFish = getLastDayTotal();
	const message = 'Day #' + dayNumber + ', '
	+ totalFish + ' total fish'
	console.log(message);
};

// PLAY FISH GAME

for (let index = 0; index < 256; index++) {
	incrementDay();
	// console.log(days[index]);
}
reportFishStatus();
const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const fishies = fileText.trim().split(',');

let days = [
	[]
];

fishies.forEach(function(string){
	days[0].push(parseInt(string,10));
})

// fishies is now an array of numbers (not strings!)

const getLastDay = function () {
	let lastDay = days.length - 1;
	return lastDay;
}

const getLastDayTotal = function () {
	const fishies = days[getLastDay()];
	let total = 0;
	fishies.forEach(function (fish) {
		total += 1;
	})
	return total;
}

const incrementDay = function () {
	newDayFish = [];
	babyFish = [];
	let fishies = days[getLastDay()];
	fishies.forEach(function (fish) {
		if (fish === 0) {
			newDayFish.push(6);
			babyFish.push(8);
		} else {
			let agingFish = fish - 1;
			newDayFish.push(agingFish);
		}
	})
	days.push(newDayFish.concat(babyFish));
};

const reportFishStatus = function () {
	const fishList = days[getLastDay()];
	const dayNumber = getLastDay();
	const totalFish = getLastDayTotal();
	const message = 'Day #' + dayNumber + ', '
	+ totalFish + ' total fish'
	// + ': ' + fishList;
	console.log(message);
};

// PLAY FISH GAME

for (let index = 0; index < 80; index++) {
	incrementDay();
	reportFishStatus();
}
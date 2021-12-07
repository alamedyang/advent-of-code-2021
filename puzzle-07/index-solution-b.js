const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const crabs = fileText.trim().split(',');


const getCostForCrabToPosition = function (crab, position) {
	const distance = Math.abs(crab - position);
	const result = getTriangularNumber(distance);
	return result;
}

const costForAllCrabsToMoveToPosition = function (position) {
	let totalCost = 0;
	crabs.forEach(function (crab){
		totalCost += getCostForCrabToPosition(crab,position);
	})
	return totalCost;
};

const getTriangularNumber = function (input) {
	let result = 0;
	result = input * (input + 1) / 2; // apparently this is the formula
	return result;
}

// console.log(getTriangularNumber(1));
// console.log(getTriangularNumber(2));
// console.log(getTriangularNumber(3));
// console.log(getTriangularNumber(4));
// console.log(getTriangularNumber(5));
// console.log(getTriangularNumber(6));

// move 1 = 1
// move 2 = 3 (1 + 2)
// move 3 = 6 (1 + 2 + 3)
// move 3 = 10 (1 + 2 + 3 + 4)
// move 3 = 15 (1 + 2 + 3 + 4 + 5)
// move 3 = 21 (1 + 2 + 3 + 4 + 5 + 6)
// move 3 = 28 (1 + 2 + 3 + 4 + 5 + 6 + 7)
// move 3 = 36 (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8)
// move 3 = 45 (1 + 2 + 3 + 4 + 5 + 6 + 7 + 8 + 9)

const maxCrab = Math.max(...crabs);
const minCrab = Math.min(...crabs);

const findMinCrabPosition = function () {
	let cheapest = costForAllCrabsToMoveToPosition(0);
	let winningPosition = null;
	for (let index = minCrab; index < maxCrab; index++) {
		const test = costForAllCrabsToMoveToPosition(index);
		if (test < cheapest) {
			cheapest = test;
			winningPosition = index;
		}
	}
	return winningPosition;
}

const winningPosition = findMinCrabPosition()

console.log('Efficient position: ' + winningPosition);
console.log('Fuel cost: ' + costForAllCrabsToMoveToPosition(winningPosition));
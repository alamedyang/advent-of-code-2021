const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const crabs = fileText.trim().split(',');


const getCostForCrabToPosition = function (crab, position) {
	const fuelCost = Math.abs(crab - position);
	return fuelCost;
}

const costForAllCrabsToMoveToPosition = function (position) {
	let totalCost = 0;
	crabs.forEach(function (crab){
		totalCost += getCostForCrabToPosition(crab,position);
	})
	return totalCost;
};


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
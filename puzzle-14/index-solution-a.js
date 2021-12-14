const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME INPUT

const halves = fileText.trim().split('\n\n');

let molecule = halves[0];
let formulae = {};

halves[1].split('\n').forEach(function (formula) {
	const formulaBreakdown = formula.split(' -> ');
	const double = formulaBreakdown[0];
	const insertion = formulaBreakdown[1];
	Object.assign(formulae, {
		[double]: insertion
	})
});

console.log(formulae);

const gameTic = function (mole) {
	let splits = mole.split('');
	let newMole = splits[0];
	for (let index = 1; index < splits.length; index++) {
		const lookup = splits[index-1] + splits[index];
		const insertion = formulae[lookup];
		newMole = newMole + insertion + splits[index];
	}
	molecule = newMole;
}

const game = function () {
	for (let index = 0; index < 10; index++) {
		gameTic(molecule);
		console.log(molecule.length);
	}
	return molecule;
}

let tally = {};

const countAtoms = function (mole) {
	mole.split('').forEach(function (atom) {
		tally[atom] = tally[atom] || 0;
		tally[atom] += 1;
	})
	return tally;
}

game(molecule);
countAtoms(molecule);
console.log(tally);

const max = Math.max(...Object.values(tally));
const min = Math.min(...Object.values(tally));
const result = max - min

console.log("result: " + result);







console.log('breakpoint plz')
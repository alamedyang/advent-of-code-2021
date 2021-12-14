const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path');
const dataPath = path.join(__dirname , 'input-sample.txt');
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

// console.log(formulae);

// OKAY DOING IT OVER I HAVE AN IDEA

const mutations = {};

Object.keys(formulae).forEach(function (small) {
	const pieces = small.split('');
	const insertion = formulae[small];
	const mutation1 = pieces[0] + insertion;
	const mutation2 = insertion + pieces[1];
	Object.assign(mutations, {
		[small]: [mutation1, mutation2]
	})
})

// console.log(mutations);

const startAtom = molecule[0];
const endAtom = molecule[molecule.length-1];

let advancedTally = {};

for (let index = 1; index < molecule.length; index++) {
	const pair = molecule[index-1] + molecule[index];
	advancedTally[pair] = advancedTally[pair] || 0;
	advancedTally[pair] += 1;
}

// console.log(advancedTally); // logging the count of pairs

// RUNNING THE GAME... AGAIN

const iterateFancy = function () {
	let newTally = {};
	Object.keys(advancedTally).forEach(function (pair) {
		let count = advancedTally[pair];
		// console.log('pair: ' + pair);
		const newPairs = mutations[pair];
		// console.log('newPairs: ' + newPairs);
		newPairs.forEach(function (newPair) {
			newTally[newPair] = newTally[newPair] || 0;
			newTally[newPair] += count;
		})
	})
	advancedTally = newTally;
}

for (let index = 0; index < 40; index++) {
	iterateFancy();
}

let fancyNewFinalTally = {};

const countAtoms = function () {
	Object.keys(advancedTally).forEach(function (pair) {
		let atoms = pair.split('');
		let count = advancedTally[pair];
		atoms.forEach(function (atom) {
			fancyNewFinalTally[atom] = fancyNewFinalTally[atom] || 0;
			fancyNewFinalTally[atom] += count;
		})
	})
	fancyNewFinalTally[startAtom] += 1;
	fancyNewFinalTally[endAtom] += 1;
	Object.keys(fancyNewFinalTally).forEach(function (atom) {
		fancyNewFinalTally[atom] = fancyNewFinalTally[atom] / 2;
	})
}
countAtoms();
console.log(fancyNewFinalTally);



// END STATE

const max = Math.max(...Object.values(fancyNewFinalTally));
const min = Math.min(...Object.values(fancyNewFinalTally));
const result = max - min

console.log("result: " + result); // orig got as far as step 22 before I'm like O.o


console.log('breakpoint plz')
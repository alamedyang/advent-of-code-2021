const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')


// COMMON STUFF

const lines = fileText.trim().split('\n');

// const findValueAtCoordinate = function (array) { // [x,y]
// 	const x = array[0];
// 	const y = array[1];
// 	return (numberHeightMap[y] || [])[x]; // single number
// };

const characters = {
	paren: {
		open: '(',
		close: ')',
	},
	square: {
		open: '[',
		close: ']',
	},
	curly: {
		open: '{',
		close: '}',
	},
	carrot: {
		open: '<',
		close: '>',
	},
}

const charactersAlt = {
	open: {
		paren: '(',
		square: '[',
		curly: '{',
		carrot: '<',
	},
	close: {
		paren: ')',
		square: ']',
		curly: '}',
		carrot: '>',
	},
}

const reducePairs = function (line) {
	let result = line.replace('()','')
		.replace('{}','')
		.replace('[]','')
		.replace('<>','');
	return result;
}

const simplifyLine = function (line) {
	let newLine = line;
	while (newLine !== reducePairs(newLine)) {
		newLine = reducePairs(newLine);
	}
	return newLine;
}

const lineToArray = function (line) {
	return line.split('');
}
const arrayToLine = function (array) {
	return array.join('');
}

const findFirstCloseIndex = function (simplifiedLine) {
	let array = lineToArray(simplifiedLine);
	let minIndex = lines[0].length;
	Object.values(charactersAlt.close).forEach(function (character) {
		let charIndex = array.indexOf(character) || -1;
		// console.log(character + ' + ' + charIndex)
		if (
			charIndex !== -1
		) {
			minIndex = Math.min(charIndex, minIndex);
		}
	})
	if (minIndex === lines[0].length) {
		minIndex = null;
	}
	return minIndex;
}

let reverses = [];

let getReverses = function () {
	lines.forEach(function (line) {
		let simple = simplifyLine(line)
		let targetIndex = findFirstCloseIndex(simple)
		// console.log('index: ' + targetIndex + ' -- ' + simple)
		if (targetIndex === null) {
			let reverseArrayReversed = [];
			let reverseArray = lineToArray(simple).reverse();
			// console.log(reverseArray)
			reverseArray.forEach(function (character) {
				if (character === '(') {
					reverseArrayReversed.push(')')
				} else if (character === '[') {
					reverseArrayReversed.push(']')
				} else if (character === '{') {
					reverseArrayReversed.push('}')
				} else {
					reverseArrayReversed.push('>')
				}
			})
			let reverseString = reverseArrayReversed.join('')
			reverses.push(reverseString)
		}
	})
	return reverses;
}

getReverses();

let getPointsFromReverse = function (reverse) {
	let reversesArray = lineToArray(reverse);
	let points = 0;
	reversesArray.forEach(function (character) {
		if (character === ')') {
			points = points * 5 + 1;
		} else if (character === ']') {
			points = points * 5 + 2;
		} else if (character === '}') {
			points = points * 5 + 3;
		} else {
			points = points * 5 + 4;
		}
	})
	return points;
}

const sortNumber = function (a,b) {
	return a-b;
}

const finalScores = reverses
	.map(getPointsFromReverse)
	.sort(sortNumber);

console.log(reverses)

const middleScore = finalScores[
	Math.floor(finalScores.length/2)
];

console.log(middleScore)
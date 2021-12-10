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

const pointsByLineAndCloseIndex = function (simplifiedLine, index) {
	let result = undefined;
	if (index !== null) {
		const array = lineToArray(simplifiedLine);
		const scores = {
			')': 3,
			']': 57,
			'}': 1197,
			'>': 25137,
		}
		const character = array[index];
		result = scores[character] || null;
	}
	// console.log(result)
	return result; 
}

// console.log(lines[2])
// let testSimple = simplifyLine(lines[2])
// console.log(testSimple)
// let testCloseIndex = findFirstCloseIndex(testSimple);
// console.log(testCloseIndex)
// let testResult = pointsByLineAndCloseIndex(testSimple,testCloseIndex);
// console.log(testResult)


let runGame = function () {
	let sum = 0;
	lines.forEach(function (line) {
		let result = 0;
		let simple = simplifyLine(line)
		let targetIndex = findFirstCloseIndex(simple)
		if (targetIndex !== null) {
			result = pointsByLineAndCloseIndex(simple, targetIndex)
		}
		// console.log(result)
		sum += result;
	})
	return sum;
}
console.log(runGame())

// console.log(simplifyLine(lines[0]))  // [({([[{{
// console.log(simplifyLine(lines[1]))  // ({[<{(
// console.log(simplifyLine(lines[2]))  // {([(<[}>{{[(
// console.log(simplifyLine(lines[3]))  // ((((<{<{{

// console.log(pointsByCloseIndex('({[<{(',findFirstCloseIndex('({[<{(')))
// console.log(pointsByCloseIndex('{([(<[}>{{[(',findFirstCloseIndex('{([(<[}>{{[(')))




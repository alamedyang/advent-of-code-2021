const { strictEqual } = require('assert');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING GAME BOARD

const lines = fileText.trim().split('\n');

const addThings = function (string1, string2) {
	return '[' + string1 + ',' + string2 + ']';
}

const reverseString = function (string) {
	let result = JSON.stringify(string).replaceAll('"','');
	if (result.length > 1) {
		result = result.split('').reverse().join('');
	}
	return result;
}

const findNumberFromLeft = function (string) {
	let result = '';
	for (let index = 0; index < string.length; index++) {
		const char = string[index];
		if (char === '[' || char === ']' || char === ',') {
			if (result.length != 0) {
				break;
			}
		} else {
			result = result + char;
		}
	}
	if (result.length === 0) {
		result = null;
	}
	return result;
}

const findNumberFromRight = function (string) {
	let resultArray = [];
	for (let index = string.length; index > 0; index--) {
		const char = string[index];
		if (char === '[' || char === ']' || char === ',') {
			if (resultArray.length > 1) {
				break;
			}
		} else {
			resultArray.push(char);
		}
	}
	let result = null;
	if (resultArray.length > 1) {
		result = resultArray.reverse().join('');
	}
	return result;
}

const physics = function (origString) {
	let string = origString;
	let state = {
		pc: 0,
		squareCount: 0,
		explosion: false,
		split: false,
	}
	let stringArray = [];
	const renewStringArray = function () {
		stringArray = string.split('');
	}
	renewStringArray();
	const getNextChar = function () {
		let result = stringArray[state.pc];
		state.pc += 1;
		return result;
	}
	const explode = function (index) {
		console.log(`Explosion at index ${index}!`)
		state.pc = index;
		let exploded = '';
		while (!exploded.includes(']')) { 
			newChar = getNextChar();
			exploded += newChar;
		}
		state.squareCount -=1;
		state.explosion = true;
		console.log(`Pair exploded: ${exploded}`);
		let tempArray = string.split('');
		let temp1 = tempArray.splice(0,index);
		let tempExploded = tempArray.splice(0,exploded.length);
		let temp2 = JSON.parse(JSON.stringify(tempArray));
		let newTempStart = temp1.join(''); // LOLOLOL T.T
		let newTempEnd = temp2.join('');
		let newTempCenter = '0';
		let leftDigit = findNumberFromRight(newTempStart);
		let rightDigit = findNumberFromLeft(newTempEnd);
		const explodedDigits = exploded
				.replace('[','')
				.replace(']','')
				.split(',');
		let newLeftDigit;
		let newRightDigit;
		if (leftDigit) {
			newLeftDigit = parseInt(leftDigit,10) + parseInt(explodedDigits[0],10);
			let startReverse = reverseString(newTempStart);
			let reverseOld = reverseString(leftDigit);
			let reverseNew = reverseString(newLeftDigit);
			startReverse = startReverse.replace(reverseOld,reverseNew);
			newTempStart = reverseString(startReverse);
		}
		if (rightDigit) {
			newRightDigit = parseInt(rightDigit,10) + parseInt(explodedDigits[1],10);
			newTempEnd = newTempEnd.replace(rightDigit,newRightDigit);
		}
		string = newTempStart + newTempCenter + newTempEnd;
		renewStringArray();
	}
	const attemptExplosion = function () {
		while (state.explosion === false) {
			const char = getNextChar();
			const index = state.pc - 1;
			if (char === '[') {
				state.squareCount += 1;
			}
			if (char === ']') {
				state.squareCount -= 1;
			}
			if (state.squareCount > 4) {
				explode(index);
			}
			if (state.pc === string.length) {
				break
			}
		}
		state.pc = 0;
	}
	const attemptSplit = function () {
		let cache = '';
		let number = null;
		let insert = null;
		for (let index = 0; index < string.length; index++) {
			const char = getNextChar();
			if (char === '[' || char === ']' || char === ',') {
				if (cache.length > 1) {
					break
				}
				cache = '';
			} else {
				cache += char;
			}
		}
		if (cache.length > 1) {
			number = parseInt(cache,10);
			insert = JSON.stringify([
				Math.floor(number/2),Math.ceil(number/2)
			])
			state.split = true;
			console.log(`Split at index ${state.pc - 1}!`);
			console.log(`${number} split into ${insert}!`)
			string = string.replace(cache,insert);
			renewStringArray();
		}
	}
	attemptExplosion();
	if (state.explosion === false) {
		attemptSplit();
	}
	console.log(string);
	return string;
}

const sample0 = '[[[[[9,8],1],2],3],4]'; // becomes [[[[0,9],2],3],4]
const sample1 = '[7,[6,[5,[4,[3,2]]]]]'; // becomes [7,[6,[5,[7,0]]]]
const sample2 = '[[6,[5,[4,[3,2]]]],1]'; // becomes [[6,[5,[7,0]]],3]
const sample3 = '[[3,[2,[1,[7,3]]]],[6,[5,[4,[3,2]]]]]'; // becomes [[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]
const sample4 = '[[3,[2,[8,0]]],[9,[5,[4,[3,2]]]]]'; // becomes [[3,[2,[8,0]]],[9,[5,[7,0]]]]

const sampleA = addThings('[[[[4,3],4],4],[7,[[8,4],9]]]','[1,1]')

let test = sampleA;

const doHomework = function (homework) {
	console.log(homework);
	let result = homework;
	let oldResult;
	while (oldResult != result) {
		oldResult = result;
		result = physics(result);
	}
	console.log('DONE');
	return result;
};

const doAllHomework = function (lines) {
	let first = lines.shift();
	while (lines.length > 0) {
		let next = lines.shift();
		console.log(`${lines.length + 2} homework assignments left!`)
		let homework = addThings(first,next);
		first = doHomework(homework);	
	}
	return first;
}

// const sampleC = addThings('[[[[4,0],[5,4]],[[7,7],[6,0]]],[[8,[7,7]],[[7,9],[5,0]]]]','[[2,[[0,8],[3,4]]],[[[6,7],1],[7,[1,6]]]]');
// // SHOULD BE [[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]

// const sampleD = addThings('[[[[6,7],[6,7]],[[7,7],[0,7]]],[[[8,7],[7,7]],[[8,8],[8,0]]]]','[[[[2,4],7],[6,[0,5]]],[[[6,8],[2,8]],[[2,1],[4,5]]]]');
// // SHOULD BE [[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]

// const sampleE = addThings('[[[[7,0],[7,7]],[[7,7],[7,8]]],[[[7,7],[8,8]],[[7,7],[8,7]]]]','[7,[5,[[3,8],[1,4]]]]')
// // SHOULD BE [[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]

// const sampleF = addThings('[[[[7,7],[7,8]],[[9,5],[8,7]]],[[[6,8],[0,8]],[[9,9],[9,0]]]]','[[2,[2,2]],[8,[8,1]]]')
// // SHOULD BE [[[[6,6],[6,6]],[[6,0],[6,7]]],[[[7,7],[8,9]],[8,[8,1]]]]

// doHomework(sampleC);

// const sampleX = ['[1,1]','[2,2]','[3,3]','[4,4]','[5,5]'] // should be [[[[3,0],[5,3]],[4,4]],[5,5]]
// const sampleY = ['[1,1]','[2,2]','[3,3]','[4,4]','[5,5]','[6,6]'] // should be [[[[5,0],[7,4]],[5,5]],[6,6]]

let finishedHomework = doAllHomework(lines);

const incrementViaMagnitude = function (homeworkString) {
	let string = homeworkString;
	let state = {
		indexOfInterest: null,
		open: false,
		number1: '',
		comma: false,
		number2: '',
		close: false,
		longForm: '',
	};
	const resetProgress = function () {
		state.indexOfInterest = null;
		state.open = false;
		state.number1 = '';
		state.comma = false;
		state.number2 = '';
		state.close = false;
		state.longForm = '';
	};
	const interestFound = function () {
		let tempArray = string.split('');
		let temp1 = tempArray.splice(0,state.indexOfInterest);
		let tempExploded = tempArray.splice(0,state.longForm.length);
		let temp2 = JSON.parse(JSON.stringify(tempArray));
		let newTempStart = temp1.join('');
		let newTempEnd = temp2.join('');
		let newTempCenter = parseInt(state.number1,10) * 3 + parseInt(state.number2,10) * 2;
		string = newTempStart + newTempCenter + newTempEnd;
		resetProgress();
		return newTempCenter;
	}
	for (let index = 0; index < homeworkString.length; index++) {
		const char = homeworkString[index];
		if (char === '[') {
			resetProgress();
			state.indexOfInterest = index;
			state.open = true;
		}
		if (char === ',') {
			if (state.open && state.number1.length) {
				state.comma = true;
			} else {
				resetProgress();
			}
		}
		if (char === ']') {
			if (
				state.open
				&& state.number1.length
				&& state.comma
				&& state.number2.length
			) {
				state.close = true;
				break
			} else {
				resetProgress();
			}
		}
		if (char != '[' && char != ']' && char != ',') {
			if (
				state.open
				&& !state.comma
			) {
				state.number1 += char;
			} else if (
				state.open
				&& state.comma
			) {
				state.number2 += char;
			} else {
				resetProgress();
			}
		}
	}
	let result = null;
	if (state.close) {
		state.longForm = '[' + state.number1 + ',' + state.number2 + ']'
		result = interestFound();
	}
	return string;
};

const getFullMagnitude = function (_string) {
	let string = _string;
	while (incrementViaMagnitude(string) != string) {
		string = incrementViaMagnitude(string);
	}
	return string;
}

console.log(getFullMagnitude(finishedHomework));

console.log('breakpoint me');
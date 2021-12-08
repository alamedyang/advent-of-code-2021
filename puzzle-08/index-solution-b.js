const fs = require('fs');
const { get } = require('http');
const { type } = require('os');
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const lines = fileText.trim().split('\n');
const lineLefts = [];
const lineRights = [];

const getNumbersFromLineHalves = function (lineHalves) {
	return lineHalves.split(' ');
}

lines.forEach(function (line) {
	let splits = line.split(' | ');
	lineLefts.push(getNumbersFromLineHalves(splits[0]));
	lineRights.push(getNumbersFromLineHalves(splits[1]));
})

var sevenSegmentKey = {
	1: 'cf',      // 2 //   ..c..f.
	7: 'acf',     // 3 //   a.c..f.
	4: 'bcdf',    // 4 //   .bcd.f.
	2: 'acdeg',   // 5 //   a.cde.g
	3: 'acdfg',   // 5 //   a.cd.fg
	5: 'abdfg',   // 5 //   ab.d.fg
	6: 'abdefg',  // 6 //   ab.defg
	0: 'abcefg',  // 6 //   abc.efg
	9: 'abcdfg',  // 6 //   abcd.fg
	8: 'abcdefg', // 7 //   abcdefg
}

// total counts:
// e = 4
// b = 6
// d = 7
// g = 7
// a = 8
// c = 8
// f = 9

const sevenSegmentStringToArray = function (string) {
	let result = string.split('').sort(); // also sorted; maybe it will help?
	return result;
}

const getTally = function (string) {
	let stringTally = {
		a: 0,
		b: 0,
		c: 0,
		d: 0,
		e: 0,
		f: 0,
		g: 0,
	}; // I'm sure there's a better way of doing this, but ehhh
	let stringArray = sevenSegmentStringToArray(string);
	stringArray.forEach(function (digit) {
		stringTally[digit] += 1;
	})
	return stringTally;
}

// console.log(getTally('abcd'))

const findLettersInAButNotB = function (a,b) {
	let aTally = getTally(a);
	let bTally = getTally(b);
	let newTally = {
		a: aTally.a - bTally.a,
		b: aTally.b - bTally.b,
		c: aTally.c - bTally.c,
		d: aTally.d - bTally.d,
		e: aTally.e - bTally.e,
		f: aTally.f - bTally.f,
		g: aTally.g - bTally.g,
	}
	let answer = '';
	Object.keys(newTally).forEach(function (key) {
		if (newTally[key] === 1) {
			answer += key;
		}
	})
	return answer;
};

const findLettersInCommonForThreeWords = function (a,b,c) {
	let aTally = getTally(a);
	let bTally = getTally(b);
	let cTally = getTally(c);
	let newTally = {
		a: aTally.a + bTally.a + cTally.a,
		b: aTally.b + bTally.b + cTally.b,
		c: aTally.c + bTally.c + cTally.c,
		d: aTally.d + bTally.d + cTally.d,
		e: aTally.e + bTally.e + cTally.e,
		f: aTally.f + bTally.f + cTally.f,
		g: aTally.g + bTally.g + cTally.g,
	}
	let answer = '';
	Object.keys(newTally).forEach(function (key) {
		if (newTally[key] === 3) {
			answer += key;
		}
	})
	// console.log(newTally)
	return answer;
};

// put a "lineLefts[0]" (etc) into here:
// example data: ['fdeba', 'beagfd', 'gbafe', 'dagb', 'dbf', 'ecfad', 'bd', 'dgcaefb', 'fbecgd', 'abfecg']
const examineLeft = function (leftScenario) {
	let ordered = [];
	let fiveDigitStrings = [];
	let sixDigitStrings = [];
	leftScenario.forEach (function(string) {
		if (string.length === 7) {
			ordered[8] = string; // 0. the 7-digit number is 8
		} else if (string.length === 2) {
			ordered[1] = string; // 1. the 2-digit number is 1
		} else if (string.length === 3) {
			ordered[7] = string; // 2. the 3-digit number is 7
		} else if (string.length === 4) {
			ordered[4] = string; // 3. the 4-digit number is 4
		} else if (string.length === 6) {
			sixDigitStrings.push(string);
		} else if (string.length === 5) {
			fiveDigitStrings.push(string);
		}
	}) // there are three six-digit words and three five-digit words that must be identified
	let tempIndex = null;
	sixDigitStrings.forEach(function (string, index) {
		if (findLettersInAButNotB(ordered[1],string)) {
			ordered[6] = string; // 4. the 6-digit number that is missing one of the letters from 1 is 6
			tempIndex = index;
		}
	})
	sixDigitStrings.splice(tempIndex, 1);
	const maskFourAgainstOne = findLettersInAButNotB(ordered[4],ordered[1]);
	fiveDigitStrings.forEach(function (string, index) {
		if (findLettersInAButNotB(string,maskFourAgainstOne).length === 3) {
			ordered[5] = string; // 5. of the three 5-digit numbers, only 5 has only one of two of the letters present in 4 but not 1
			tempIndex = index;   // (this letter is B; all three 5-digit numbers have the other letter, D)
		}
	})
	fiveDigitStrings.splice(tempIndex, 1);
	fiveDigitStrings.forEach(function (string, index) {
		if (findLettersInAButNotB(ordered[1],string).length === 0) {
			ordered[3] = string; // 6. between the remaining 5-digit numbers (2 and 3), 3 has both of the letters present in 1 (C and F)
		} else {
			ordered[2] = string; // 7. the last 5-digit number is 2
		}
	})
	const fiveDigitCommons = findLettersInCommonForThreeWords(ordered[2],ordered[3],ordered[5]);
	// 8. of the letters the 5-digit numbers have in common (ADG), 9 has one; D (0 has none)
	// 9. 0 is the remaining number
	// if (findLettersInAButNotB(fiveDigitCommons,sixDigitStrings[0]) === 1) {
	// 	ordered[9] = sixDigitStrings[0];
	// 	ordered[0] = sixDigitStrings[1];
	// } else {
	// 	ordered[0] = sixDigitStrings[0];
	// 	ordered[9] = sixDigitStrings[1];
	// }
	// IT DIDN'T WORK
	// Instead:
	// 0 has more numbers not in 5 than 9; mask order doesn't matter here
	if (
		findLettersInAButNotB(sixDigitStrings[0], ordered[5]).length >
		findLettersInAButNotB(sixDigitStrings[1], ordered[5]).length
	) {
		ordered[0] = sixDigitStrings[0];
		ordered[9] = sixDigitStrings[1];
	} else {
		ordered[9] = sixDigitStrings[0];
		ordered[0] = sixDigitStrings[1];
	}
	return ordered;
};

const sortWord = function (word) {
	const wordArray = sevenSegmentStringToArray(word);
	let wordAgain = wordArray.join('');
	return wordAgain;
}

const identifyRightFromLeftExamination = function (left,right) {
	let leftAnswer = examineLeft(left);
	let leftAnswerSorted = [];
	leftAnswer.forEach (function (word) {
		let makeArray = sevenSegmentStringToArray(word);
		let wordAgain = makeArray.join('');
		leftAnswerSorted.push(wordAgain);
	});
	let rightInputSorted = [];
	right.forEach (function (word) {
		let makeArray = sevenSegmentStringToArray(word);
		let wordAgain = makeArray.join('');
		rightInputSorted.push(wordAgain);
	})
	// console.log(rightInputSorted)
	answer = '';
	rightInputSorted.forEach(function (word) {
		const realDigit = leftAnswerSorted.indexOf(word);
		answer += realDigit;
	})
	return answer;
}
const testLeft = [
	'abcdefg',
	'bcdef',
	'acdfg',
	'abcdf',
	'abd',
	'abcdef',
	'bcdefg',
	'abef',
	'abcdeg',
	'ab'
];
// is this the normal number pattern though?

console.log(examineLeft(testLeft));

const testRight = ['cdfeb','fcadb','cdfeb','cdbaf'];
const testLeft2 = ['be','cfbegad','cbdgef','fgaecd','cgeb','fdcge','agebfd','fecdb','fabcd','edb']
const testRight2 = ['fdgacbe','cefdb','cefbgd','gcbe'];
const testLeft3 = ['edbfga','begcd','cbg','gc','gcadebf','fbgde','acbgfd','abcde','gfcbed','gfec']
const testRight3 = ['fcgedb','cgb','dgebacf','gc'];
const testLeft4 = ['fgaebd','cg','bdaec','gdafb','agbcfd','gdcbef','bgcad','gfac','gcb','cdgabef']
const testRight4 = ['cg','cg','fdcagb','cbg'];

// console.log(identifyRightFromLeftExamination(testLeft,testRight)) // should be 5353
// console.log(identifyRightFromLeftExamination(testLeft2,testRight2)) // should be 8394
// console.log(identifyRightFromLeftExamination(testLeft3,testRight3)) // should be 9781
// console.log(identifyRightFromLeftExamination(testLeft4,testRight4)) // should be 1197

let grandFinale = 0;

lineRights.forEach(function (input, index) {
	let result = identifyRightFromLeftExamination(lineLefts[index],input);
	grandFinale += parseInt(result,10);
	// console.log(result);
})

console.log(grandFinale) // 1066381 first try is too low
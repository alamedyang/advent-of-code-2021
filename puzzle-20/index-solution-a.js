const { strictEqual } = require('assert');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING INPUT

const inputBlocks = fileText.trim().split('\n\n');
const enhanceAlgorithm = inputBlocks[0];
const origImage = inputBlocks[1].split('\n'); // array of strings -- NOT an array of arrays!

// META

const logImage = function (image) {
	let result = image.join('\n');
	result += '\n';
	console.log(result);
	return result;
}

const padImage = function (imageArray, padChar) {
	let origLength = imageArray[0].length;
	let newLength = origLength + 2;
	let blankLine = '';
	for (let index = 0; index < newLength; index++) {
		blankLine += padChar;
	}
	let paddedImageArray = [
		blankLine
	]
	imageArray.forEach(function (line) {
		const newLine = padChar + line + padChar;
		paddedImageArray.push(newLine);
	})
	paddedImageArray.push(blankLine);
	return paddedImageArray;
};

const padImageXTimes = function (_imageArray, padChar, _times) {
	let times = _times || 1;
	let imageArray = _imageArray.slice()
	for (let index = 0; index < times; index++) {
		imageArray = padImage(imageArray, padChar);
	}
	return imageArray;
};

const getHeightOfImage = function (imageArray) {
	return imageArray[0].length;
}

const getWidthOfImage = function (imageArray) {
	return imageArray.length;
}

const getBinaryValueFromPosition = function (x, y, image, padChar) {
	let result = '';
	for (let yIndex = -1; yIndex < 2; yIndex++) {
		for (let xIndex = -1; xIndex< 2; xIndex++) {
			let checkThis = image[y + yIndex][x + xIndex] || padChar;
			if (checkThis === '#') { // BROKEN
				result += '1';
			} else {
				result += '0'
			}
		}
	}
	return result;
}

const getNewValueFromBinaryValue = function (binaryString) {
	const lookup = parseInt(binaryString,2);
	return enhanceAlgorithm[lookup];
}

// const test = getBinaryValueFromPosition(2, 2, origImage, '.')
// console.log(test);
// console.log(getNewValueFromBinaryValue(test));

// RUN GAME

const playGameWithXGenerations = function (_image, qty) {
	let image = JSON.parse(JSON.stringify(_image || origImage));
	let generation = 0;
	let padWithChar = '.';
	image = padImageXTimes(image, padWithChar, 2);
	const incrementGeneration = function () {
		generation += 1;
		if (generation % 2 === 1) {
			padWithChar = enhanceAlgorithm[0];
		} else {
			padWithChar = enhanceAlgorithm[enhanceAlgorithm.length-1];
		}
	}
	for (let index = 0; index < qty; index++) {
		image = padImageXTimes(image, padWithChar, 2);
		console.log(`Generation ${generation}. Padding 2 times with char '${padWithChar}'`);
		const imageHeight = getHeightOfImage(image);
		const imageWidth = getWidthOfImage(image);
		let newImage = [];
		for (let yIndex = 1; yIndex < imageHeight-1; yIndex++) {
			let newString = '';
			for (let xIndex = 1; xIndex < imageWidth-1; xIndex++) {
				const binary = getBinaryValueFromPosition(xIndex, yIndex, image, padWithChar);
				const newValue = getNewValueFromBinaryValue(binary);
				newString += newValue;
			}
			newImage.push(newString);
		}
		image = newImage;
		incrementGeneration();
		// logImage(image);
	}
	return image;
}
console.log(enhanceAlgorithm);

let tally = 0;

let resultingImage = playGameWithXGenerations(origImage, 2);
resultingImage.forEach(function (line) {
	line.split('').forEach(function (char) {
		if (char === '#') {
			tally += 1;
		}
	})
})

console.log(tally);


// (starting at 9:30pm (-16 minutes), ending 10:53pm)

console.log('breakpoint me');
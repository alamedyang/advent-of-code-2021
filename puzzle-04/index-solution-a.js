const fs = require('fs')
const path = require('path')
const dataPath = path.join(__dirname , 'input.txt')
const fileText = fs.readFileSync(dataPath, 'utf-8')

const lines = fileText.trim().replace(/\r/g,'').split('\n\n');

const winningBingoes = [
	[0, 5, 10, 15, 20],
	[1, 6, 11, 16, 21],
	[2, 7, 12, 17, 22],
	[3, 8, 13, 18, 23],
	[4, 9, 14, 19, 24],
	[0, 1, 2, 3, 4],
	[5, 6, 7, 8, 9],
	[10, 11, 12, 13, 14],
	[15, 16, 17, 18, 19],
	[20, 21, 22, 23, 24],
];

let moves = lines.shift();
let movesArray = moves.split(','); // NOTE: the numbers are strings
// the list of moves as a bunch of numbers (as strings)

let cards = [];
let cardsStatus = [];
let bingo = false;
let bingoWinner;
let currentTurn;

lines.forEach (function (item) {
	let card = item.replace(/\s+/g,'-'); // getting rid of multiple spaces
	card = card.split('-');
	// now a card is an array of 25 strings
	cards.push(card);
	// could've done the below separately but ehh
	let cardStatus = [];
	cardStatus.length = 25;
	cardStatus.fill(false);
	cardsStatus.push(cardStatus);
})

let makeAMove = function (moveNumber) {
	cards.forEach(function(card, index){
		const bingoNumber = movesArray[moveNumber]; // should be 6
		const cardTokenAtIndex = card.indexOf(bingoNumber); // should be 4
		let status = cardsStatus[index]
		status[cardTokenAtIndex] = true;
		// console.log(status);
	})
};

let evaluateOneCardBingo = function (cardIndex) {
	winningBingoes.forEach(function (winningCombo){
		let status = cardsStatus[cardIndex];
		if (
			status[winningCombo[0]] === true &&
			status[winningCombo[1]] === true &&
			status[winningCombo[2]] === true &&
			status[winningCombo[3]] === true &&
			status[winningCombo[4]] === true
		) {
			console.log('Card number ' + cardIndex + ' got BINGO!');
			bingo = true;
			bingoWinner = cardIndex;
		}
	})
};

let evaluateAllCardsBingo = function () {
	cardsStatus.forEach(function (item, cardIndex){
		evaluateOneCardBingo(cardIndex);
	})
}

let winningScore = function (cardIndex) {
	let sum = 0;
	const winningCardNumbers = cards[cardIndex];
	const winningCardStatus = cardsStatus[cardIndex];
	winningCardStatus.forEach(function(token, index){
		if (token === false) {
			sum += parseInt(winningCardNumbers[index],10);
		}
	})
	return sum;
};

// PLAY BINGO

for (
		let index = 0;
		(index < 30) && (bingo === false);
		index++
	) {
	makeAMove(index);
	const result = movesArray[index];
	console.log('Move #'+index+': ' +result);
	currentTurn = index;
	evaluateAllCardsBingo();
}

let finishingBoard = winningScore(bingoWinner);
let finalScore = finishingBoard * movesArray[currentTurn];
console.log(
	'The board was worth ' + finishingBoard + ' points '
	+ 'on turn #' + currentTurn + ', '
	+ 'with a final number callout of ' + movesArray[currentTurn] + '.'
);
console.log('Final score: ' + finishingBoard + ' x ' + movesArray[currentTurn] + ' = ' + finalScore)


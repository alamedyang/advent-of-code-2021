const { strictEqual } = require('assert');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING INPUT (starting at 6:53pm)

const inputLines = fileText.trim().split('\n');

let players = {};

inputLines.forEach(function (line) {
	const splits = line.replace('Player ','').split(' starting position: ');
	players[splits[0]] = {
		position: parseInt(splits[1],10),
		score: 0,
	};
})

// PREPARING GAME

let currentDiceRoll = 1;
let currentDiceCount = 0;

const rollDiceThrice = function () {
	let diceSum = 0;
	let diceLog = 'rolling: ';
	for (let index = 0; index < 3; index++) {
		diceSum += currentDiceRoll;
		diceLog += ' + ' + currentDiceRoll;
		currentDiceRoll += 1;
		currentDiceCount += 1;
		if (currentDiceRoll === 101) {
			currentDiceRoll = 1;
		}
	}
	diceLog += ' = ' + diceSum;
	console.log(diceLog);
	return diceSum;
}

const incrementPawn = function (playerNumber) {
	const rollValue = rollDiceThrice();
	const oldPosition = players[playerNumber].position;
	let newPosition = (oldPosition + rollValue) % 10;
	newPosition = newPosition === 0 ? 10 : newPosition;
	players[playerNumber].position = newPosition;
	players[playerNumber].score += newPosition;
	console.log(`Player ${playerNumber} was at tile ${oldPosition}, moving ${rollValue} to tile ${newPosition} (Score: ${players[playerNumber].score})`)
	return players[playerNumber].score;
}

let winningState = {};
let winningDice = null;

const playGame = function () {
	let continueGame = true;
	while (continueGame) {
		Object.keys(players).forEach(function (player) {
			incrementPawn(player);
			if (players[player].score >= 1000) {
				winningDice = currentDiceCount;
				continueGame = false;
				winningState = JSON.parse(JSON.stringify(players));
				console.log(winningState);
				console.log(`Dice has been rolled ${winningDice} times!`)
			}
		})
	}
	return winningDice;
}

winningDice = playGame();
let losingScore = Infinity;

Object.keys(winningState).forEach(function (player) {
	losingScore = Math.min(losingScore, winningState[player].score);
})


const result = winningDice * losingScore;
console.log(`WINNING DICE COUNT (${winningDice}) * LOSING SCORE (${losingScore}) = ${result}`);

console.log('breakpoint me');
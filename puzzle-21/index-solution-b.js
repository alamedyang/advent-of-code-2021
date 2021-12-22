const { strictEqual } = require('assert');
const fs = require('fs');
const path = require('path');
const { resourceLimits } = require('worker_threads');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8');

// PREPARING INPUT (starting at 6:53pm)

const inputLines = fileText.trim().split('\n');

// GAME META

const convertGameObjectToString = function (gameObject) {
	let string =
		gameObject['1'].position + ':'
		+ gameObject['1'].score + '|'
		+ gameObject['2'].position + ':'
		+ gameObject['2'].score + '|'
		+ gameObject['lastMoved'];
	return string;
}

const convertGameStringToObject = function (gameString) {
	const playersStrings = gameString.split('|');
	const player1 = playersStrings[0].split(':');
	const player2 = playersStrings[1].split(':');
	const player1Position = parseInt(player1[0],10);
	const player1Score = parseInt(player1[1],10);
	const player2Position = parseInt(player2[0],10);
	const player2Score = parseInt(player2[1],10);
	let players = {};
	players['1']= {
		position: player1Position,
		score: player1Score,
	};
	players['2'] = {
		position: player2Position,
		score: player2Score,
	};
	players.lastMoved = playersStrings[2];
	return players;
};

// ESTABLISHING INITIAL STATE

// You want the game state to be tracked like:
// Each player position can be: 1, 2, or 3 (combos possible: 9)
// Each player score can be: 0-21 (combos possible: 441) (up to 3969 total)
// Player that last moved (double the above)
// Universe qty with the above status

let gameStates = {
	// '0:0|0:0|1': 0 // position1, score1 | position2, score2 | lastMovedPlayer : universeCount
};
let winningGames = {}; // put universes here when you're done with them

let playersAtStart = {}; // don't wanna redo anything I don't have to

inputLines.forEach(function (line) {
	const splits = line.replace('Player ','').split(' starting position: ');
	playersAtStart[splits[0]] = {
		position: parseInt(splits[1],10),
		score: 0,
	};
})
playersAtStart.lastMoved = 2;
const initialGameString = convertGameObjectToString(playersAtStart);
gameStates[initialGameString] = 1;

// console.log(gameStates); // should be '{4:0|8:0|2: 0}'
// console.log(convertGameStringToObject('4:0|8:0|2'));

// DO A TURN

const getIncrementedPosition = function (currentPosition, rollValue) {
	let newPosition = (currentPosition + rollValue) % 10;
	newPosition = newPosition === 0 ? 10 : newPosition;
	return newPosition;
}

const iterateUniverses = function () {
	let iteratedUniverses = {};
	Object.keys(gameStates).forEach(function (gameString) {
		const gameObject = convertGameStringToObject(gameString);
		const universeCount = gameStates[gameString];
		const currentPlayer = gameObject.lastMoved === '1' ? '2' : '1';
		for (let dice1 = 1; dice1 <= 3; dice1++) {
			for (let dice2 = 1; dice2 <= 3; dice2++) {
				for (let dice3 = 1; dice3 <= 3; dice3++) {
					let tempGameObject = JSON.parse(JSON.stringify(gameObject));
					const rollTotal = dice1 + dice2 + dice3;
					const oldPos = tempGameObject[currentPlayer].position;
					const newPos = getIncrementedPosition(oldPos, rollTotal);
					tempGameObject[currentPlayer].position = newPos;
					tempGameObject[currentPlayer].score += newPos;
					tempGameObject.lastMoved = currentPlayer;
					const gameStateString = convertGameObjectToString(tempGameObject);
					if (tempGameObject[currentPlayer].score >= 21) {
						winningGames[gameStateString] = (winningGames[gameStateString] || 0) + universeCount;
					} else {
						iteratedUniverses[gameStateString] = (iteratedUniverses[gameStateString] || 0) + universeCount;
					}
				}
			}
		}
	})
	gameStates = iteratedUniverses;
};

while (Object.keys(gameStates).length > 0) {
	iterateUniverses();
}

let winningUniverses = {
	'1': 0,
	'2': 0,
};

Object.keys(winningGames).forEach(function (universe) {
	const splits = universe.split('|');
	const winner = splits[2];
	const qty = winningGames[universe];
	winningUniverses[winner] += qty;
})

let finalAnswer = Math.max(winningUniverses['1'], winningUniverses['2']);
console.log(`Winning player wins in ${finalAnswer} universes.`);

console.log('breakpoint me');
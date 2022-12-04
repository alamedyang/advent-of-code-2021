const fs = require('fs');
const path = require('path')

const dataPath = path.join(__dirname , 'input.txt');
const sampleDataPath = path.join(__dirname , 'input-sample.txt');

const fileText = fs.readFileSync(dataPath, 'utf-8');
const sampleFileText = fs.readFileSync(sampleDataPath, 'utf-8');

// redone 2022-12-04
// works for both parts

const doFish = (inputString, generations) => {
	// prepare fish state
	const fishMap = [];
	fishMap.length = 9;
	fishMap.fill(0, 0, 9);

	// tally fish count
	inputString.split(',').forEach((fish) => {
		fishMap[parseInt(fish,10)] += 1;
	})

	// iterate generations
	for (let i = 0; i < generations; i++) {
		fishMap.push(fishMap.shift());
		fishMap[6] += fishMap[8];
	}

	// sum fish
	return fishMap.reduce((prev, cur) => prev + cur, 0);
}

console.log("PART 1 - 80 generations");
console.log("   sample:", doFish(sampleFileText, 80));
console.log("   real input:", doFish(fileText, 80));

console.log("PART 2 - 256 generations");
console.log("   sample:", doFish(sampleFileText, 256));
console.log("   real input:", doFish(fileText, 256));

const fs = require('fs');
const path = require('path');
const dataPath = path.join(__dirname , 'input.txt');
const fileText = fs.readFileSync(dataPath, 'utf-8').trim();

const hexToBinary = function (hex) {
	const hexArray = hex.split('');
	let binary = '';
	hexArray.forEach(function (digit) {
		binary += hexLookup[digit];
	})
	return binary;
}
const hexLookup = {
	'0': '0000',
	'1': '0001',
	'2': '0010',
	'3': '0011',
	'4': '0100',
	'5': '0101',
	'6': '0110',
	'7': '0111',
	'8': '1000',
	'9': '1001',
	'A': '1010',
	'B': '1011',
	'C': '1100',
	'D': '1101',
	'E': '1110',
	'F': '1111',
}

const sample = 'D2FE28';
const sample0 = '38006F45291200';
const sampleA = 'EE00D40C823060';
const sample1 = '8A004A801A8002F478';
const sample2 = '620080001611562C8802118E34';
const sample3 = 'C0015000016115A2E0802F182340';
const sample4 = 'A0016C880162017C3686B18A3D4780';

const parseLiteral = function (_bitArray) {
	let bitArray = _bitArray;
	let literalString = '';
	let loggedBitArray = [];
	let keepReading = '1';
	while (keepReading === '1') {
		let number = bitArray.splice(0,5);
		loggedBitArray = loggedBitArray.concat(number);
		keepReading = number.shift();
		literalString += number.join('');
	}
	console.log('literal: ' + literalString + '(full bitStream: ' + loggedBitArray.join('') + ')');
	// while (bitArray.length % 4 != 0) {
	// 	bitArray.shift();
	// }
	const literal = parseInt(literalString,2);
	console.log('packet type: literal value (' + literal + ')')
	return {
		type: 'literal',
		value: literal,
		log: loggedBitArray.join(''),
		remainingBitArray: bitArray,
	};
};

const parseOp = function (_bitArray) {
	let bitArray = _bitArray.slice();
	const lengthTypeID = bitArray.shift();
	const result = {
		type: 'operation',
		parseLog: []
	};
	let loggedBitArray = [];
	if (lengthTypeID === '0') {
		const rawTotalLengthBits = bitArray.splice(0,15);
		loggedBitArray = loggedBitArray.concat(rawTotalLengthBits);
		const totalLengthBits = parseInt(rawTotalLengthBits.join(''),2);
		// console.log('rawTotalLengthBits: ' + rawTotalLengthBits);
		// console.log('totalLengthBits: ' + totalLengthBits);
		let subPacketBitArray = bitArray.splice(0, totalLengthBits)
		while (subPacketBitArray.length) {
			const packetResult = parseNextPacket(
				subPacketBitArray,
				result.parseLog
			)
			subPacketBitArray = packetResult.remainingBitArray
		}
		result.totalLengthBits = totalLengthBits;
	} else {
		const rawSubpacketQuantity = bitArray.splice(0,11);
		loggedBitArray = loggedBitArray.concat(rawSubpacketQuantity);
		const subpacketQuantity = parseInt(rawSubpacketQuantity.join(''),2);
		// console.log('rawSubpacketQuantity: ' + rawSubpacketQuantity);
		// console.log('subpacketQuantity: ' + subpacketQuantity);
		result.subpacketQuantity = subpacketQuantity;
		for (let i = 0; i < subpacketQuantity; i++) {
			const packetResult = parseNextPacket(
				bitArray,
				result.parseLog
			)
			bitArray = packetResult.remainingBitArray
		}
	}
	result.log = loggedBitArray.join('');
	result.remainingBitArray = bitArray;
	return result;
};

const parseNextPacket = function (_bitArray, parseLog) {
	let bitArray = _bitArray.slice();
	const versionRaw = bitArray.splice(0,3).join('');
	const version = parseInt(versionRaw,2);
	const typeIDRaw = bitArray.splice(0,3).join('');
	const typeID = parseInt(typeIDRaw,2);
	const logPrefix = versionRaw.concat(typeIDRaw);
	console.log('version: ' + version + ' -- typeID: ' + typeID);
	const result = {
		version,
		typeID,
		logPrefix,
	}
	let merge = {}
	if (typeID === 4) {
		merge = parseLiteral(bitArray);
	} else {
		merge = parseOp(bitArray);
	}
	Object.assign(result, merge);

	parseLog.push(result);
	if(result.parseLog) {
		parseLog.push(...result.parseLog)
	}

	return result;
}

const parseAllPackets = function (bitString, parseLog) {
	let bitsArray = bitString.split('');
	console.log(bitsArray)
	// let versionNumberTotal = 0
	while (bitsArray.length > 7) {
		const parsedPacket = parseNextPacket(bitsArray, parseLog);
		bitsArray = parsedPacket.remainingBitArray;
		// const theyAreSuperEqual = parsedPackets[parsedPackets.length-1] === parsedPacket;
	}
	console.log('finished');
};

const countVersionNumbers = function (parsedPackets) {
	let tally = 0;
	parsedPackets.forEach(function (packet) {
		tally += packet.version;
	})
	return tally;
}



let parsedPackets = [];
parseAllPackets(
	hexToBinary(sample0),
	parsedPackets,
);
console.log(parsedPackets);
console.log(countVersionNumbers(parsedPackets));


let mostComplexPackets = [];
parseAllPackets(
	hexToBinary(sample4),
	mostComplexPackets,
);
console.log(mostComplexPackets);
console.log(countVersionNumbers(mostComplexPackets));


let realDealPackets = [];
parseAllPackets(
	hexToBinary(fileText),
	realDealPackets,
);
console.log(realDealPackets);
console.log(countVersionNumbers(realDealPackets));

console.log('breakpoint');

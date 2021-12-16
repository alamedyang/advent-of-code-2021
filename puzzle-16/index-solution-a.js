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

let parsedPackets = [];

const parseLiteral = function (_bitArray) {
	let bitArray = _bitArray;
	let literal = '';
	let loggedBitArray = [];
	while (bitArray[0] === '1') {
		let number = bitArray.splice(0,5);
		loggedBitArray = loggedBitArray.concat(number);
		number.shift();
		literal += number.join('');
	}
	let numberEnd = bitArray.splice(0,5);
	loggedBitArray = loggedBitArray.concat(numberEnd);
	numberEnd.shift();
	literal += numberEnd.join('');
	// console.log('literal: ' + literal + '(' + loggedBitArray.join('') + ')');
	// while (bitArray.length % 4 != 0) {
	// 	bitArray.shift();
	// }
	literal = parseInt(literal,2);
	// console.log('packet type: literal value (' + literal + ')')
	const result = {
		literal,
		log: loggedBitArray.join(''),
		remainingBitstream: bitArray.join(''),
	};
	return result;
};

const parseOp = function (_bitArray) {
	let bitArray = _bitArray;
	let lengthTypeID = bitArray.shift();
	let result = {};
	let loggedBitArray = [];
	if (lengthTypeID === '0') {
		const rawTotalLengthBits = bitArray.splice(0,15);
		loggedBitArray = loggedBitArray.concat(rawTotalLengthBits);
		const totalLengthBits = parseInt(rawTotalLengthBits.join(''),2);
		// console.log('rawTotalLengthBits: ' + rawTotalLengthBits);
		// console.log('totalLengthBits: ' + totalLengthBits);
		result['totalLengthBits'] = totalLengthBits;
		result['log'] = loggedBitArray.join('');
		result['remainingBitstream'] = bitArray.join('');
	} else {
		const rawSubpacketQuantity = bitArray.splice(0,11);
		loggedBitArray = loggedBitArray.concat(rawSubpacketQuantity);
		const subpacketQuantity = parseInt(rawSubpacketQuantity.join(''),2);
		// console.log('rawSubpacketQuantity: ' + rawSubpacketQuantity);
		// console.log('subpacketQuantity: ' + subpacketQuantity);
		result['subpacketQuantity'] = subpacketQuantity;
		result['log'] = loggedBitArray.join('');
		result['remainingBitstream'] = bitArray.join('');
	}
	return result;
};

const parseNextPacket = function (bits) {
	let bitArray = bits.split('');
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
	if (typeID === 4) {
		const merge = parseLiteral(bitArray);
		Object.assign(result, merge);
	} else {
		const merge = parseOp(bitArray);
		Object.assign(result, merge);
	}
	return result;
}

const parseAllPackets = function (_bitStream) {
	let bitStream = _bitStream;
	// let versionNumberTotal = 0
	let totalLengthBits = null;
	let subpacketQuantity = null;
	while (bitStream.length != 0) {
		const result = parseNextPacket(bitStream);
		parsedPackets.push(result);
		if (subpacketQuantity) {
			subpacketQuantity -= 1;
		}
		if (totalLengthBits) {
			let packetSize = result.logPrefix.length + result.log.length;
			totalLengthBits -= packetSize;
		}
		if (result.subpacketQuantity) {
			subpacketQuantity = result.subpacketQuantity;
		}
		if (result.totalLengthBits) {
			totalLengthBits = result.totalLengthBits;
		}
		if (totalLengthBits === 0 || subpacketQuantity === 0) {
			break
		}
		bitStream = result.remainingBitstream;
	}
	console.log(parsedPackets);
	return parsedPackets;
};

const countVersionNumbers = function () {
	let tally = 0;
	parsedPackets.forEach(function (packet) {
		tally += packet.typeID;
	})
	return tally;
}



const sample1 = '8A004A801A8002F478';
const sample2 = '620080001611562C8802118E34';
const sample3 = 'C0015000016115A2E0802F182340';
const sample4 = 'A0016C880162017C3686B18A3D4780';

parseAllPackets(hexToBinary('8A004A801A8002F478'));
console.log(countVersionNumbers());

console.log('breakpoint');
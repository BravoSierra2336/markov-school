/** Command-line tool to generate Markov text. */

const fs = require('fs');
const axios = require('axios');
const process = require('process');
const { MarkovMachine } = require('./markov');

function printErrorAndExit(msg) {
	console.error(`Error: ${msg}`);
	process.exit(1);
}

async function generateTextFromFile(path) {
	try {
		const data = fs.readFileSync(path, 'utf8');
		const mm = new MarkovMachine(data);
		console.log(mm.makeText());
	} catch (err) {
		printErrorAndExit(`Could not read file '${path}': ${err.message}`);
	}
}

async function generateTextFromUrl(url) {
	try {
		const resp = await axios.get(url);
		const mm = new MarkovMachine(resp.data);
		console.log(mm.makeText());
	} catch (err) {
		printErrorAndExit(`Could not read URL '${url}': ${err.message}`);
	}
}

async function main() {
	const [,, method, source] = process.argv;
	if (method === 'file') {
		await generateTextFromFile(source);
	} else if (method === 'url') {
		await generateTextFromUrl(source);
	} else {
		printErrorAndExit("Usage: node makeText.js [file|url] [path|url]");
	}
}

main();


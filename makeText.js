/** Command-line tool to generate Markov text. */

const util = require('util');
const fs  = require('fs');
const axios = require('axios');
const { stripHtml } = require("string-strip-html");
const { MarkovMachine } = require('./markov');


const readFile = util.promisify(fs.readFile);

async function makeText() {
    if (process.argv[2] == 'file') {
        const text = await readFile(process.argv[3], 'utf8').catch(err => {
            console.log(`Error reading file ${process.argv[3]}`);
            process.exit(1);
        });
        const mm = new MarkovMachine(text);
        console.log(mm.makeBigramText());

    } else if (process.argv[2] == 'url') {
        const resp = await axios.get(process.argv[3],{validateStatus: false});
        if ([200,201,202,203,204].includes(resp.status)) {
            const strippedData = stripHtml(resp.data).result;
            const mm = new MarkovMachine(strippedData);
            console.log(mm.makeBigramText());
        } else {
            console.log(`Error requesting from ${process.argv[3]}`);
            process.exit(1);
        }
    } else {
        console.log(`Not an allowed source type: ${process.argv[2]}`);
        process.exit(1);
    }
};

makeText();
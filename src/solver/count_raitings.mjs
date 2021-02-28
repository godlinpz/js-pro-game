import { readFileSync } from 'fs';
const rates = JSON.parse(readFileSync('./allAttacks.json'));

console.log(rates);

const counts = [];
rates.forEach((r) => {
    const key = '_' + r[0];

    if (!counts[key]) counts[key] = 1;
    else counts[key]++;
});

const c1 = [];

for (let c in counts) console.log(c, counts[c]);

import { readFileSync, writeFileSync } from 'fs';

function randomInt(from, to) {
    return ((Math.random() * (to - from)) | 0) + from;
}

function randomAttacks(rate) {
    /*
        Берём по одной атаке и вкладываем в случайное направление атаки.
        Если направление набраро максимум, то больше в него не вкладываем.
    */

    const maxAtt = 10;
    const att = [1, 1, 1, 1];
    // хранит, какие направления атаки еще не на максимуме
    let cols = [0, 1, 2, 3];

    for (let i = 4; i < rate; ++i) {
        const n = cols[randomInt(0, cols.length)];
        att[n]++;

        if (att[n] === maxAtt) cols = cols.filter((col) => col !== n);
    }

    return att;
}

const pokesJson = readFileSync('./pokemonsData.json');

const pokes = JSON.parse(pokesJson);

// сортируем покемонов по весу

const wlist = pokes
    .reduce((weights, p, pos) => {
        if (!weights[p.weight]) weights[p.weight] = [];
        weights[p.weight].push(pos);
        return weights;
    }, [])
    .reduce((weights, w, pos) => (w && weights.push([pos, w]) && weights) || weights, []);

// Задаём атаки в зависимости от веса по гиперболическому закону:
// чем больше атака, тем меньше таких покемонов.
// Сделал поменьше покемонов с атаками 1-1-1-1 -- они скучные :)

const allAttacks = [];

wlist.map(([w, pokePositions], pos) => {
    // y = 1/(x - 4.5) - 0.222
    const x = (4 / wlist.length) * pos;
    // Гипербола
    // const rate = -(1/(x - 4.5) - 0.222)*20.7 - 4.4 | 0;
    // Тангенс
    let rate = ((Math.tan(x * 0.714 - 1.4) / 3 + 3) * 8 - 4) | 0;
    rate < 40 || (rate = 40);
    const att = randomAttacks(rate);

    // console.log(att, rate);

    allAttacks.push([rate, att]);
    pokePositions.map((p) => (pokes[p].attacks = [rate, att]));
});

writeFileSync('./pokemonsDataUpdated2.json', JSON.stringify(pokes));
writeFileSync('./allAttacks.json', JSON.stringify(allAttacks));
/**/

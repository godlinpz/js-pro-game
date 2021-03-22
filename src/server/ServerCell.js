import _ from 'lodash';
import ServerGameObject from './ServerGameObject';
import Cell from '../models/Cell';

let npcId = 1;
let npcNames = [
    'Papazol',
    'Ibuprofen',
    'Omez',
    'Plakvenil',
    'Metatrixat',
    'Afobazon',
    'Noshpa',
    'Amilatex',
    'Epinifril',
    'Finibut',
];

const nextNpc = function () {
    const name = npcNames.length ? _.sample(npcNames) : 'Anonymous';
    npcNames = npcNames.filter((n) => n !== name);
    const id = npcId++;

    // console.log('nextNpc', name, id, npcNames.length, npcNames);

    return [name, 'npc_' + id];
};

class ServerCell extends Cell {
    constructor(cfg) {
        super(cfg);
    }

    createGameObject(objCfg) {
        return new ServerGameObject(objCfg);
    }

    addNpc(obj) {
        const { cellX, cellY } = this;

        const game = this.map.game;
        const [npcName, npcId] = nextNpc();

        const layer = obj.layer + 1;

        const player = { id: npcId, name: npcName, skin: game.getRandomSkin(), isNpc: true, cellX, cellY, layer };

        // console.log('NPC', player);

        game.createPlayer(player);

        return super.addNpc(obj);
    }
}

export default ServerCell;

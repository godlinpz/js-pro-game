import _ from 'lodash';
import ServerGameObject from './ServerGameObject';
import Cell from '../models/Cell';

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
        const name = _.sample(ServerCell.npcNames);

        const layer = obj.layer + 1;

        const player = { id: ServerCell.npcId++, name, skin: game.getRandomSkin(), isNpc: true, cellX, cellY, layer };

        // console.log('NPC', player);

        game.createPlayer(player);

        return super.addNpc(obj);
    }
}

ServerCell.npcId = 1;
ServerCell.npcNames = [
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

export default ServerCell;

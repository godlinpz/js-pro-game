import { clamp } from '../engine/util';
import ClientCell from './ClientCell';
import ClientMapWindow from './ClientMapWindow';
import GameMap from '../engine/GameMap';

class ClientMap extends GameMap {
    constructor(game, engine, levelCfg) {
        super(game, engine, levelCfg);

        Object.assign(this, {
            window: new ClientMapWindow(Object.assign({ map: this }, levelCfg.window)),
        });
    }

    createCell(cfg) {
        return new ClientCell(cfg);
    }

    init() {
        const win = this.window.cfg;

        this.cellWidth = (this.engine.canvas.width / win.width) | 0;
        this.cellHeight = (this.engine.canvas.height / win.height) | 0;

        this.window.init();
        super.init();
    }

    getRenderRange() {
        const win = this.window;
        return { startCell: win.startCell(), endCell: win.endCell() };
    }

    render(time, timeGap) {
        const win = this.window;

        win.render(time, timeGap);

        super.render(time, timeGap);
    }
}

export default ClientMap;

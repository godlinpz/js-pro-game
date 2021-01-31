import ServerCell from './ServerCell';
import ServerMapWindow from './ServerMapWindow';
import GameMap from '../engine/GameMap';

class ServerMap extends GameMap {
    constructor(game, engine, levelCfg) {
        super(game, engine, levelCfg);

        Object.assign(this, {
            window: new ServerMapWindow(Object.assign({ map: this }, levelCfg.window)),
        });
    }

    createCell(cfg) {
        return new ServerCell(cfg);
    }

    init() {
        const win = this.window.cfg;

        this.cellWidth = (this.engine.canvas.width / win.width) | 0;
        this.cellHeight = (this.engine.canvas.height / win.height) | 0;

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

export default ServerMap;

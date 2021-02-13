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

    renderLayer(time, timeGap, layerId, range) {
        const layer = this.layers[layerId];
        if (layer.isStatic) {
            const { engine, window } = this;
            const layerName = 'static_layer_' + layerId;
            const windowPos = window.worldBounds();

            if (!layer.isRendered) {
                const range = super.getRenderRange();

                engine.addCanvas(layerName, this.worldWidth, this.worldHeight);
                engine.switchCanvas(layerName);
                window.moveTo(0, 0, false);

                super.renderLayer(time, timeGap, layerId, range);

                window.moveTo(windowPos.x, windowPos.y, false);

                engine.switchCanvas('main');

                layer.isRendered = true;
            }

            engine.renderCanvas(layerName, windowPos, { x: 0, y: 0, width: windowPos.width, height: windowPos.height });
        } else super.renderLayer(time, timeGap, layerId, range);
    }
}

export default ClientMap;

import { animate, clamp } from '../engine/util';
import GameObject from '../models/GameObject';

class ServerGameObject extends GameObject {
    constructor(cfg) {
        super(cfg);
    }

    render(time, timeGap) {
        super.render(time, timeGap);

        return [time, timeGap];
    }
}

export default ServerGameObject;

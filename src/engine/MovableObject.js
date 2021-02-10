import { clamp, animate } from '../engine/util';
import PositionedObject from './PositionedObject';

class MovableObject extends PositionedObject {
    constructor(cfg) {
        super(cfg);

        Object.assign(
            this,
            {
                toX: 0,
                toY: 0,
                deltaX: 0,
                deltaY: 0,

                speed: 0,

                motionStartTime: 0,
            },
            cfg,
        );
    }

    moveTo(x, y, smooth = true, speed = 200) {
        const { map } = this;
        const [newX, newY] = [
            clamp(x, 0, map.worldWidth - this.width - 1),
            clamp(y, 0, map.worldHeight - this.height - 1),
        ];

        if (smooth) {
            this.startMotion(newX, newY, speed);
        } else {
            this.x = newX;
            this.y = newY;
        }
    }

    startMotion(newX, newY, speed) {
        Object.assign(this, {
            motionStartTime: this.map.engine.lastRenderTime,
            speed: speed,
            toX: newX,
            toY: newY,
            deltaX: newX - this.x,
            deltaY: newY - this.y,
        });

        this.trigger('animation-started');
    }

    animateMotion(time) {
        if (this.speed) {
            const me = this;
            const [newX, newY] = [
                me.toX + animate(me.deltaX, me.motionStartTime, time, me.speed) - me.deltaX,
                me.toY + animate(me.deltaY, me.motionStartTime, time, me.speed) - me.deltaY,
            ];

            if (newX === me.toX && newY === me.toY) {
                me.speed = 0;
                me.motionStartTime = 0;
                me.trigger('motion-stopped');
            }

            me.x = newX;
            me.y = newY;
        }
    }

    render(time, timeGap) {
        this.animateMotion(time);
    }
}

export default MovableObject;

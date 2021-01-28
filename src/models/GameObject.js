import { animate } from '../engine/util';
import MovableObject from '../engine/MovableObject';

class GameObject extends MovableObject {
    constructor(cfg) {
        super(cfg);

        const { x, y } = cfg.cell ? cfg.cell.worldPosition() : { x: 0, y: 0 };

        Object.assign(
            this,
            {
                x,
                y,
                state: 'main',
                size: 100,
                layer: 0,
                spriteSize: 80,
                animationStartTime: 0,
                stateDelay: null,
            },
            cfg,
        );
    }

    setCell(cell) {
        this.cell = cell;
    }

    setState(state, delay = 0) {
        clearTimeout(this.stateDelay);
        if (delay) this.stateDelay = setTimeout(() => this.setState(state), delay);
        else {
            this.state = state;
            this.animationStartTime = this.cell.map.engine.lastRenderTime;
        }
    }

    getCurrentFrame(time) {
        const state = this.cfg.states[this.state];
        const len = state.frames.length;
        const frame = ((len + animate(len, this.animationStartTime, time, state.duration, true)) | 0) % len;
        // console.log('Frame', frame);
        return state.frames[frame];
    }

    moveToCell(cell, smooth = true, speed = 200) {
        if (this.cell) this.cell.remove(this);

        cell.push(this);
        this.moveTo(cell.x, cell.y, smooth, speed);
    }

    render(time, timeGap) {
        if (this.speed) {
            this.animateMotion(time);
        }

        // inherit to render
        return [time, timeGap];
    }
}

export default GameObject;

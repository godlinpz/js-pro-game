import EventSourceMixin from './EventSourceMixin';

class Input {
    constructor() {}
}

Object.assign(Input.prototype, EventSourceMixin);

export default Input;

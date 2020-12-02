class EventSource {
    constructor() {
        this.subscribers = {};
    }

    pushEvent(event, sub) {
        if (!this.subscribers[event]) this.subscribers[event] = [];
        this.subscribers[event].push(sub);
    }

    on(event, callback) {
        this.pushEvent(event, [true, callback]);
    }

    once(event, callback) {
        this.pushEvent(event, [false, callback]);
    }

    trigger(event, data = null) {
        if (this.subscribers[event]) {
            this.subscribers[event].forEach((sub) => sub[1](event, data));
            // удаляем все одноразовые обработчики
            this.subscribers[event] = this.subscribers[event].filter((sub) => sub[0]);
        }
    }
}

export default EventSource;

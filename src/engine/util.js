export function clamp(x, from_x, to_x) {
    if (x < from_x) x = from_x;
    if (x > to_x) x = to_x;

    return x;
}

export function animate(dx, startTime, currentTime, speed, looped = false) {
    let t = (speed && (currentTime - startTime) / speed) || 0;

    if (looped) t = t % 1;
    else if (t > 1) t = 1;

    // console.log(dx, startTime, currentTime, speed, t, dx*t);

    return dx * t;
}

export function animateObject(obj, { newX, newY, map, speed, time }) {
    if (time) {
        const [newX, newY] = [
            obj.toX + animate(obj.deltaX, obj.motionStartTime, time, obj.speed) - obj.deltaX,
            obj.toY + animate(obj.deltaY, obj.motionStartTime, time, obj.speed) - obj.deltaY,
        ];

        if (newX === obj.toX && newY === obj.toY) {
            obj.speed = 0;
            obj.motionStartTime = 0;
            if (obj['trigger']) obj.trigger('animation-stopped');
        }

        obj.x = newX;
        obj.y = newY;
    } else {
        obj.motionStartTime = map.engine.lastRenderTime;
        obj.speed = speed;
        obj.toX = newX;
        obj.toY = newY;
        obj.deltaX = newX - obj.x;
        obj.deltaY = newY - obj.y;
        if (obj['trigger']) obj.trigger('animation-started');
    }
}

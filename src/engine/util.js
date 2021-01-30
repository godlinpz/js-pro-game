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

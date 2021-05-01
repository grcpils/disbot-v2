module.exports = function timeToString(time) {
    time = Math.floor(time);
    if (time < 60) {
        return `${time} second(s)`;
    } else if (time > 60) {
        return `${Math.floor(time/60)} minute(s)`;
    } else {
        return `${time}`;
    }
    return `error`;
}
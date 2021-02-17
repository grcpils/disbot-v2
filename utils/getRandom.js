module.exports = getRandom = function (list) {
    return list[Math.floor((Math.random()*list.length))];
}
const { emoji } = require('../config.json');
const Embed = require('../utils/embeds.js');

module.exports = function amountIsCorrect(message, amount) {
    if (amount == undefined || Number.isNaN(amount)) {
        let error = Embed.warning(`The amount sent must be a number !`, '')
        message.channel.send(error);
        message.react(emoji.error);
        return false;
    }
    if (Math.sign(amount) == -1 || Math.sign(amount) == 0) {
        let warning = Embed.warning(`Amount must be a positive value ...`, '')
        message.channel.send(warning);
        message.react(emoji.warning);
        return false;
    }
    return true;
}
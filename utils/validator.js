const { emoji } = require('../config.json');
const Embed = require('./embeds.js');
const code = require('./code.js');

module.exports = function Validator(message) {
    this.message = message;
    this.isValidAmount = function(amount) {
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
    };
    this.isValidMention = function(mention, argString) {
        if (mention == undefined) {
            msg = Embed.error(`This is not a correct user !`, '');
            message.channel.send(msg);
            message.react(emoji.error);
            return false;
        }
        return true;
    }
}
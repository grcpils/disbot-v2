const { emoji, admin } = require('../config.json');

module.exports = {
	name: 'exit',
    description: '...',
    usage: '!exit',
	execute(message, args) {
        if (admin.find(token => token ==  message.author.id) != undefined) {
            message.react(emoji.success);
            process.exit();
        } else {
            message.react(emoji.error);
        }

    },
};
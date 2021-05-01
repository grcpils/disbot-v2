const { emoji, admin } = require('../../config.json');

module.exports = {
	name: 'Exit Deamon Bot',
    cmd: 'exit',
	execute(message, args) {
        if (admin.find(token => token ==  message.author.id) != undefined) {
            message.react(emoji.success);
            process.exit();
        } else {
            message.react(emoji.error);
        }

    },
};
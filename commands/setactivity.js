const { emoji } = require('../config.json');

module.exports = {
	name: 'setactivity',
	description: 'Set Activity visible on the bot',
	usage: "!setactivity <activity>",
	execute(message, args) {
        client.user.setPresence({ activity: { name: args.join(" ") }, status: 'available' })
		message.channel.send(`New activity setup ;)`);
		message.react(emoji.success);
	},
};
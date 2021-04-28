const client = require("../index.js")

module.exports = {
	name: 'setactivity',
	description: 'Set Activity visible on the bot',
	usage: "!setactivity <activity>",
	execute(message, args) {
        client.user.setPresence({ activity: { name: args.join(" ") }, status: 'available' })
	},
};
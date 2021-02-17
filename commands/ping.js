module.exports = {
	name: 'ping',
	description: 'Ping!',
	usage: "!ping",
	execute(message, args) {
		message.channel.send('Pong');
	},
};
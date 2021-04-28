const fs = require('fs');
const Discord = require('discord.js');
const { prefix } = require('./config.json');
const env = require('dotenv').config();

// DISCORD
module.exports = client = new Discord.Client();
client.commands = new Discord.Collection();

client.once('ready', () => {
    console.log('Client is ready');
    client.user.setPresence({ activity: { name: 'attendre des ordres' }, status: 'available' })
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
    client.commands.set(command.name, command);
    console.info(`Registering '${command.name}' command`);
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const command = args.shift().toLowerCase();

	if (!client.commands.has(command)) return;

	try {
		client.commands.get(command).execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);
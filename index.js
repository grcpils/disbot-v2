const fs = require('fs');
const Discord = require('discord.js');
const { prefix, emoji } = require('./config.json');
const code = require('./utils/code.js');
const Embed = require('./utils/embeds.js')
const timeToString = require('./utils/timeToString.js');
const env = require('dotenv').config();

module.exports = client = new Discord.Client();
client.commands = new Discord.Collection();
client.cooldowns = new Discord.Collection();

client.once('ready', () => {
	console.log('Client is ready');
	client.user.setPresence({ activity: { name: 'attendre des ordres' }, status: 'available' })
});

const commandFolders = fs.readdirSync('./commands');
const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));


for (const folder of commandFolders) {
	const commandFiles = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
	for (const file of commandFiles) {
		const command = require(`./commands/${folder}/${file}`);
		client.commands.set(command.cmd, command);
		console.info(`Registering '${command.cmd}' command from '${folder}' folder`);
	}
}

client.on('message', message => {
	if (!message.content.startsWith(prefix) || message.author.bot) return;

	const args = message.content.slice(prefix.length).trim().split(/ +/);
	const commandName = args.shift().toLowerCase();
	const command = client.commands.get(commandName);

	if (!client.commands.has(commandName)) return;

	const { cooldowns } = client;

	if (!cooldowns.has(command.cmd)) {
		cooldowns.set(command.cmd, new Discord.Collection());
	}

	const now = Date.now();
	const timestamps = cooldowns.get(command.cmd);
	const cooldownAmount = (command.cooldown || 3) * 1000;

	if (timestamps.has(message.author.id)) {
		const expirationTime = timestamps.get(message.author.id) + cooldownAmount;

		if (now < expirationTime) {
			const timeLeft = (expirationTime - now) / 1000;
			return message.reply(`please wait ${timeToString(timeLeft.toFixed(1))} before reusing the \`${command.cmd}\` command.`);
		}
	}
	timestamps.set(message.author.id, now);
	setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);

	try {
		if (command.args != undefined && args.length < command.args) {
			let error = Embed.error('No enought arguments !', code(command.usage));
			message.channel.send(error)
			message.react(emoji.error);
			return;
		}

		command.execute(message, args);
	} catch (error) {
		console.error(error);
		message.reply('there was an error trying to execute that command!');
	}
});

client.login(process.env.TOKEN);
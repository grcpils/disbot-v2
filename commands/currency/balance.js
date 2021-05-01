const { emoji } = require('../../config.json');
const db = require('../../database/firebase.js');
const Embed = require('../../utils/embeds.js');
const code = require('../../utils/code.js');

module.exports = {
	name: 'Balance',
	cmd: 'balance',
	description: 'Get accound balance.',
	usage: "!balance",
	async execute(message, args) {

		const token = message.author.id;
		const username = message.author.username;
		const users = db.collection('users');
		const userDoc = await users.doc(token).get();
		const user = userDoc.data();
		let error;
		let msg;

		if (!userDoc.exists) {
			const newUser = {
				token: token,
				username: username,
				balance: 100
			};

			msg = Embed.info(`Oups, you don't have any account here !`, `Let me two seconds, I will create new one for you ;)`)
			message.channel.send(msg);

			let newDoc = db.collection('users').doc(token);
			await newDoc.set(newUser).then(function(){
				console.log(`new user created: ${newUser.username} ${newUser.token}`);
				msg = Embed.success(`Your account is succesfully created !`, `You've got \`${newUser.balance}\` ChL on it.`)
				message.channel.send(msg);
				message.react(emoji.success);
			})
		} else {
			const user = userDoc.data();
			console.log(`balance of ${user.username} is ${user.balance}`);
			msg = Embed.info(`Your current balance is up to:`, `${code(user.balance+' ChL')}`);
			message.channel.send(msg);
			message.react(emoji.success);
		}
	},
};
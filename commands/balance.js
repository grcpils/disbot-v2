const { emoji } = require('../config.json');
const db = require('../database/firebase.js');

module.exports = {
	name: 'balance',
	description: 'Get accound balance.',
	usage: "!balance",
	async execute(message, args) {

		const token = message.author.id;
		const username = message.author.username;
		const users = db.collection('users');
		const userDoc = await users.doc(token).get();
		const user = userDoc.data();

		if (!userDoc.exists) {
			const newUser = {
				token: token,
				username: username,
				balance: 100
			};
			message.channel.send(`Oups, you don't have any account here !\nLet me two seconds, I will create new one for you ;)`);

			let newDoc = db.collection('users').doc(token);
			await newDoc.set(newUser).then(function(){
				console.log(`new user created: ${newUser.username} ${newUser.token}`);
				message.channel.send(`Your account is succesfully created !\nYou've got \`${newUser.balance}\` ChL on it.`);
				message.react(emoji.success);
			})
		} else {
			const user = userDoc.data();
			console.log(`balance of ${user.username} is ${user.balance}`);
			message.channel.send(`Your current balance is \`${user.balance}\` ChL.`);
			message.react(emoji.success);
		}
	},
};
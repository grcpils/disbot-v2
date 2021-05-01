const { emoji } = require('../../config.json');
const getUserFromMention = require('../../utils/getUserFromMention.js');
const amountIsCorrect = require('../../utils/amountIsCorrect.js');
const db = require('../../database/firebase.js');
const Embed = require('../../utils/embeds.js');
const code = require('../../utils/code.js');

module.exports = {
	name: 'Payment',
    cmd: 'send',
	description: 'Send <amount> ChL to <@user>',
	usage: "!send <amount> <@user>",
    args: 2,
	async execute(message, args) {

		const token = message.author.id;
		const username = message.author.username;
		const users = db.collection('users');
		const senderDoc = await users.doc(token).get();
        let amount = parseInt(args[0], 10);
        let msg;

        if (amountIsCorrect(message, amount) != true) { return; }

        const mention = getUserFromMention(args[1]);
        if (mention == undefined) {
            msg = Embed.error('This is not a correct user !', '');
            message.channel.send(msg);
            message.react(emoji.error);
            return;
        }

        const getterDoc = await users.doc(mention.id).get();

        if (token == mention.id) {
            msg = Embed.error(`You cannot send ChL to yourself :/`, '');
            message.channel.send(msg);
            message.react(emoji.warning);
            return;
        }

        if (!getterDoc.exists) {
            msg = Embed.error(`This person does not have an account ... :(`, '')
            message.channel.send(msg);
            message.react(emoji.error);
            return;
        }
        if (!senderDoc.exists) {
            msg = Embed.error(`You don't have an account`, `use the command ${code('!balance')} first !`)
            message.channel.send(msg);
            message.react(emoji.error);
            return;
        }

        const sender = senderDoc.data();
        const getter = getterDoc.data();

        if (sender.balance < amount) {
            msg = Embed.warning(`Oups, you don't have funds for this payment !`, '');
            message.channel.send(msg);
            message.react(emoji.warning);
            return;
        }
        await users.doc(token).update({ balance: sender.balance -= amount });
        await users.doc(mention.id).update({ balance: getter.balance += amount });
        const transaction = {
            sender: senderDoc.ref,
            getter: getterDoc.ref,
            amount: amount
        }
        let newTransaction = db.collection('transactions').doc();
        await newTransaction.set(transaction).then(function() {
            console.log(`new transaction between '${sender.username}' and '${getter.username}' of ${amount}`);
            msg = Embed.success(`You successfully send ChL !`, `${mention} receive ${code(amount+' ChL')}from ${message.author}`);
            message.channel.send(msg);
            message.react(emoji.success);
        })
	},
};
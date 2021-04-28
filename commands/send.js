const { emoji } = require('../config.json');
const getUserFromMention = require('../utils/getUserFromMention.js');
const db = require('../database/database.js');

module.exports = {
	name: 'send',
	description: 'Send <amount> ChL to <@user>',
	usage: "!send <@user> <amount>",
	async execute(message, args) {

		const token = message.author.id;
		const username = message.author.username;
		const users = db.collection('users');
		const senderDoc = await users.doc(token).get();
        let amount = parseInt(args[0], 10);

        if (args.length < 2) {
            console.log(`no enought arguments. (${args.length})`);
            message.channel.send(`No enought arguments. (${args.length})\n\`\`\`\nUsage:\n\t!send <@user> <amount>\`\`\``)
            message.react(emoji.error);
            return;
        }

        const mention = getUserFromMention(args[1]);
        if (mention == undefined) {
            message.channel.send(`This is not a correct user... :(`);
            message.react(emoji.error);
            return;
        }
        const getterDoc = await users.doc(mention.id).get();

        if (!senderDoc.exists || !getterDoc.exists || token == mention.id) {
            message.channel.send(`An error occured during transaction... Sorry :(`);
            message.react(emoji.error);
            return;
        } else {

            const sender = senderDoc.data();
            const getter = getterDoc.data();

            if (amount == undefined) {
                message.channel.send(`The amount sent must be a number !`);
                message.react(emoji.error);
                return;
            }

            if (sender.balance < amount) {
                message.channel.send(`Oups, you don't have funds for this payment !`);
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
                message.channel.send(`${message.author} send \`${amount}\` to ${mention}`);
                message.react(emoji.success);
            })
        }
	},
};
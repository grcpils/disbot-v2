const { emoji, maximum_stealable, steal_probability } = require('../../config.json');
const getUserFromMention = require('../../utils/getUserFromMention.js');
const amountIsCorrect = require('../../utils/amountIsCorrect.js');
const db = require('../../database/firebase.js');
const Embed = require('../../utils/embeds.js');
const code = require('../../utils/code.js');

module.exports = {
	name: 'Robbery',
    cmd: 'robb',
	description: 'Try to steal <amount> to <@user>',
	usage: "!robb <amount> <@user>",
    cooldown: 3,
    args: 2,
	async execute(message, args) {

		const token = message.author.id;
		const username = message.author.username;
		const users = db.collection('users');
        const loteryDoc = db.collection('system').doc('lotery');
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
            msg = Embed.error(`You cannot robber yourself :(`, '');
            message.channel.send(msg);
            message.react(emoji.warning);
            return;
        }

        if (!getterDoc.exists) {
            msg = Embed.error(`This person does not have an account ... :(`, '');
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

        const robber = senderDoc.data();
        const victim = getterDoc.data();

        const maxStealable = (maximum_stealable * victim.balance) / 100;

        if (robber.robbering) {
            msg = Embed.warning(`You've already start a robbering !`, `You cannot start multiple robbery at the same time !`);
            message.channel.send(msg);
            message.react(emoji.warning);
            return;
        }

        if (amount > maxStealable) {
            msg = Embed.warning(`You can't steal more than ${maximum_stealable}% of your target's balance !`, `${code('max: '+Math.floor(maxStealable)+' Chl')}`);
            message.channel.send(msg);
            message.react(emoji.warning);
            return;
        }

        let robberyState = 'fail';
        await users.doc(token).update({ robbering: true });
        msg = Embed.info(`You start a robbery !`, `${message.author} try to steal ${code(amount+' ChL')} to ${mention}`);
        message.channel.send(msg);

        await new Promise(r => setTimeout(r, 10000));

        if (Math.random() < steal_probability) {
            msg = Embed.success('Steal is a success !', `${message.author} got ${code(amount+' ChL')} from ${mention} account !`);
            message.channel.send(msg);
            robberyState = 'success';
            await users.doc(token).update({ balance: robber.balance += amount, robbering: false });
            await users.doc(mention.id).update({ balance: victim.balance -= amount });
            this.cooldown = 300;
        } else {
            let lotery = (await loteryDoc.get()).data();
            msg = Embed.error(`Steal is failed !`, `${message.author} try to steal ${mention} and lose ${code(amount+' ChL')} which is added to the amount of the next lottery.`);
            message.channel.send(msg);
            robberyState = 'fail';
            await users.doc(token).update({ balance: robber.balance -= amount, robbering: false });
            await loteryDoc.update({ total:  lotery.total += amount});
            this.cooldown = 13;
        }

        const robbery = {
            robber: senderDoc.ref,
            victim: getterDoc.ref,
            amount: amount,
            is: robberyState
        }
        let newRobbery = db.collection('robbery').doc();
        await newRobbery.set(robbery).then(function() {
            console.log(`robbery in progress ${username} steal ${amount} to ${mention.username} (${robberyState})`);
            message.react(emoji.success);
        })
	},
};
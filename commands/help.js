const { emoji } = require('../config.json');

module.exports = {
	name: 'help',
    description: 'Get commands list and usage',
    usage: '!help -[l] <command>\n\tl\tlist all available commands',
	execute(message, args) {
        let find = false;

        if (args.length < 1) {
            message.channel.send(`Please specify a command name !\n\`\`\`USAGE:\t${this.usage}\`\`\``);
            message.react(emoji.error);
            find = true;
            return;
        }

        if (args[0] == '-l') {

            client.commands.forEach((cmd, key) => {
                if (cmd.name != 'help')
                    message.channel.send(`\`\`\`USAGE:\t${cmd.usage}\`\`\``);
            })
            message.react(emoji.success);
            return;
        }

        client.commands.forEach((cmd, key) => {
            if (cmd.name == args[0]) {
                message.channel.send(`${cmd.description}\n\`\`\`USAGE:\t${cmd.usage}\`\`\``);
                message.react(emoji.success);
                find = true;
                return;
            }
        })

        if (find != true) {
            message.channel.send(`Command \`${args[0]}\` not found :(`);
            message.react(emoji.error);
        }

    },
};
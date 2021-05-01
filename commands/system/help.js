require('module-alias/register')
const Discord = require('discord.js');
const { emoji, colors } = require('@root/config.json');
const Embed = require('@utils/embeds.js');
const code = require('@utils/code.js');

module.exports = {
    name: 'Helper',
    cmd: 'help',
    description: 'Get commands list and usage',
    usage: '!help -[l] <command>\n\tl\tlist all available commands',
    args: 1,
	execute(message, args) {
        let help;
        let find = false;

        if (args.length < 1) {
            let error = Embed.error(`Please specify a command name !`, cmd.usage);
            message.channel.send(error);
            message.react(emoji.error);
            find = true;
            return;
        }

        if (args[0] == '-l') {
            help = Embed.info('Commands list', 'Get list of all available commands for La Madonne.')

            client.commands.forEach((cmd, key) => {
                if (cmd.command != 'help' && cmd.usage != undefined)
                    help.addField(cmd.name, code(cmd.usage)+'\n'+cmd.description, false);
            })

            message.channel.send(help);
            message.react(emoji.success);
            return;
        }

        client.commands.forEach((cmd, key) => {
            if (cmd.command == args[0]) {
                help = Embed.info(cmd.name, cmd.description+code(cmd.usage));
                message.channel.send(help);
                message.react(emoji.success);
                find = true;
                return;
            }
        })

        if (find != true) {
            let error = Embed.error('Command not found !', `${args[0]} is not a correct command\n use \`\`\`help -l\`\`\` to see all available commands`);
            message.channel.send(error);
            message.react(emoji.error);
        }

    },
};
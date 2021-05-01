const Discord = require('discord.js');
const { colors } = require('../config.json');

function newBasicEmbed(title, description) {
    let embed = new Discord.MessageEmbed()
    .setThumbnail('https://cdn.grcpils.fr/ttk/madonne.png')
    .setTitle(title)
    .setDescription(description)
    return embed;
}

function error(title, description) {
    let embed = newBasicEmbed(title, description);
    embed.setColor(colors.error);
    return embed;
}

function success(title, description) {
    let embed = newBasicEmbed(title, description);
    embed.setColor(colors.success);
    return embed;
}

function warning(title, description) {
    let embed = newBasicEmbed(title, description);
    embed.setColor(colors.warning);
    return embed;
}

function info(title, description) {
    let embed = newBasicEmbed(title, description);
    embed.setColor(colors.info);
    return embed;
}

module.exports = {
    error,
    success,
    warning,
    info
}
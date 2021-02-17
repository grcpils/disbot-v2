const { array_259 } = require('../config.json');
const getRandom = require('../utils/getRandom');

module.exports = {
	name: '259',
    description: 'A n\'utiliser qu\'en cas d\'extrême urgence !',
    usage: '!259',
	execute(message, args) {
		message.channel.send(`${getRandom(array_259).replace('<@>', message.author)}`);
	},
};
const getRandom = require('../utils/getRandom');

random_sentences = [
	"Une phrase aléatoire ...",
	"Une autre phrase avec une mention de l'auteur ! <@>",
	"Encore une autres phrase :D"
]

module.exports = {
	name: 'random',
    description: 'Reply with a random message !',
    usage: '!random',
	execute(message, args) {
		message.channel.send(`${getRandom(random_sentences).replace('<@>', message.author)}`);
	},
};
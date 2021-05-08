const getRandom = require('../../utils/getRandom.js');

random_sentences = [
	"L'avenir se demande parfois ce que la TTK lui réserve ...",
	"Quand j'étais à l'armée ...",
	"TTK un jour, mal au cul toujours !",
	"Si le plan A foire, le TTk sait qu'il y a encore 25 lettres dans l'alphabet",
	"Tous les TTK sont intelligents, drôles, beaux ... et modestes.",
	"Le TTK n'a jamais abusé de l'alcool, il a toujours été consentant.",
	"Heuaaa tirkontsonkan !",
	"i cose pas ek couyions, i done a li rézon ... Le TTk aussi",
	"Quand tu comptes 4 couilles, c'est que l’ennemi n'est pas loin ...",
	"La team type des teams top",
	"Le bon, la brute et le président TTK",
	"N'ayez pas peur des chevaux sous le capot, mais du TTK qui conduit",
	"Pour être en forme, joue au moins une fois par semaine avec la TTK"
]

module.exports = {
	name: 'Randomizer',
	cmd: 'random',
    description: 'Reply with a random message !',
    usage: '!random',
	execute(message, args) {
		message.channel.send(`${getRandom(random_sentences).replace('<@>', message.author)}`);
	},
};
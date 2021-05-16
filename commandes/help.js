const {MessageEmbed} = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const helpEmbed = new MessageEmbed();
    const commande = bot.commands.find(c => args[0] || (c.aliases && c.aliases.includes(args[0])));
    if (commande) {
        helpEmbed.setTitle(`Aide pour la commande : ${commande.name}`);
        helpEmbed.setDescription(`<> = Requis, [] = Optionnel\nCatégorie : **${commande.category}**`);
        helpEmbed.addField('Description :', commande.description);
        helpEmbed.addField('Utilisation :', commande.syntax.length > 0 ? commande.syntax : commande.name);
        helpEmbed.addField('Description :', commande.description);
        helpEmbed.addField('Aliases :', `\`${commande.aliases.length > 0 ? commande.aliases.join('`, `') : 'Aucun'}\``);
    } else {
        helpEmbed.setTitle('Liste des commandes :');
        helpEmbed.setFooter(`*help <command> pour une aide détaillée`);
        console.log(bot.commands)
        const categories = new Set(bot.commands.map(c => c.category));
        console.log(categories)
        for (let category of categories) {
            helpEmbed.addField(category, bot.commands.map(c => `**\`${c.name}\`** : ${c.description}`));
        }
    }
    await message.channel.send(helpEmbed);
};
module.exports.config = {
    category: 'utils',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['h'],
    forceBotChannel: true,
};

module.exports.help = {
    description: 'Aide concernant le bot',
    syntax: `help\nhelp <command>`,
    examples: `help help`,
};
const {MessageEmbed} = require("discord.js");

module.exports.run = async (bot, message, args) => {
    const helpEmbed = new MessageEmbed().setColor("#4287F5")
    const commande = bot.commands.get(args[0]) || bot.commands.get(bot.aliases.get(args[0]));
    if (commande) {
        helpEmbed.setTitle(`Aide pour la commande : ${commande.config.name}`);
        helpEmbed.setDescription(`<> = Requis, [] = Optionnel\nCatégorie : **${commande.config.category}**`);
        helpEmbed.addField('Description :', commande.help.description);
        helpEmbed.addField('Utilisation :', commande.help.syntax.length > 0 ? commande.help.syntax : commande.config.name);
        helpEmbed.addField('Aliases :', `\`${commande.config.aliases.length > 0 ? commande.config.aliases.join('`, `') : 'Aucun'}\``);
    } else {
        helpEmbed.setTitle('Liste des commandes :');
        helpEmbed.setFooter(`*help <command> pour une aide détaillée`);
        const categories = new Set(bot.commands.map(c => c.config.category));
        for (let category of categories) {
            let commandes = "";
            bot.commands.forEach(c => {
                if (c.config.category === category)
                    commandes += `**\`${c.config.name}\`** : ${c.help.description}\n`;
            })
            helpEmbed.addField(category, commandes);
        }
    }
    await message.channel.send({embeds: [helpEmbed]});
};
module.exports.config = {
    category: 'Utils',
    specialPermissions: '',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['h'],
    forceBotChannel: false,
};

module.exports.help = {
    description: 'Aide concernant le bot',
    syntax: `help [command]`,
    examples: `help help`,
};

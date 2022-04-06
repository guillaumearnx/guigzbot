const {MessageEmbed} = require("discord.js");

module.exports = {
    config: {
        description: "Affiche l'aide du bot",
        category: 'Utils',
        specialPermissions: '',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        forceBotChannel: false,
    },
    options: [{type: 4, name: "commande", description: "Affiche l'aide de la commande", required: false}],
    run: async (bot, interaction) => {
        const helpEmbed = new MessageEmbed().setColor("#4287F5")
        if (interaction.options._hoistedOptions.length === 1 && interaction.options._hoistedOptions[0].name === 'commande') {
            const opt = interaction.options._hoistedOptions[0].value;
            const commande = bot.commands.get(opt) || bot.commands.get(bot.aliases.get(opt));
            if (commande) {
                helpEmbed.setTitle(`Aide pour la commande : ${commande.config.name}`);
                helpEmbed.setDescription(`<> = Requis, [] = Optionnel\nCatégorie : **${commande.config.category}**`);
                helpEmbed.addField('Description :', commande.help.description);
                helpEmbed.addField('Utilisation :', commande.help.syntax.length > 0 ? commande.help.syntax : commande.config.name);
                helpEmbed.addField('Aliases :', `\`${commande.config.aliases.length > 0 ? commande.config.aliases.join('`, `') : 'Aucun'}\``);
            }
        } else {
            helpEmbed.setTitle('Liste des commandes :');
            helpEmbed.setFooter({text: `*help <command> pour une aide détaillée`});
            const categories = new Set(bot.commands.map(c => c.config.category));
            for (let category of categories) {
                let commandes = "";
                bot.commands.forEach(c => {
                    if (c.config.category === category) commandes += `**\`${c.config.name}\`** : ${c.help.description}\n`;
                })
                helpEmbed.addField(category, commandes);
            }
        }
        await interaction.reply({embeds: [helpEmbed], ephemeral: true})
    }
}

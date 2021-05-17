const {MessageEmbed} = require("discord.js");

module.exports.run = async (bot, message, args) => {
    try {
        switch (args[0]) {
            case "guildMemberAdd":
            case "guildMemberRemove":
                await logger();
                bot.emit(args[0], message.guild.members.cache.get(message.author.id))
                break;
            default:
                message.channel.send(`L'événement ${args[0]} n'existe pas ..`)
                break;
        }
    } catch (z) {
        console.log(z)
    }

    async function logger() {
        const eventEmbed = new MessageEmbed()
            .setColor("#ffaa00")
            .setTitle("Événement simulé")
            .setFooter(`Event by ${bot.user.username}`, bot.user.displayAvatarURL())
            .setDescription(`${message.author.tag} a lancé un événement`)
            .addField("Événement", args[0])
        await message.channel.send(eventEmbed);
    }

};
module.exports.config = {
    category: 'Configuration',
    specialPermissions: 'owner',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['e'],
    forceBotChannel: true,
};

module.exports.help = {
    description: 'Émettre un événement',
    syntax: `emit <event>`,
    examples: `emit guildMemberAdd`,
};
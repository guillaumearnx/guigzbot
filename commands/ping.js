const {MessageEmbed} = require("discord.js");

module.exports.run = async (bot, message, args) => {
    let ping, pingBot;
    await message.channel.send("Ping ...").then(async (m) => {
        await m.edit("Pong ...");
        ping = m.createdTimestamp - message.createdTimestamp;
        pingBot = bot.ws.ping
        await m.delete().catch(() => undefined);
    });
    const pingEmbed = new MessageEmbed()
        .setTitle("⚙️ Test de latence ...")
        .setColor("#5865F2")
        .addField(`Latence du bot`, `${ping}ms`, true)
        .addField(`Latence de l'API`, `${pingBot}ms`, true)
        .addField(`Total`, `${ping + pingBot}ms`, false)
        .setFooter(`Ping by ${bot.user.username}`)
    await message.channel.send({embeds: [pingEmbed]});
};

module.exports.config = {
    category: 'Utils',
    specialPermissions: '',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['p'],
};

module.exports.help = {
    description: 'Latence du bot',
    syntax: `ping`,
    examples: `ping`,
};

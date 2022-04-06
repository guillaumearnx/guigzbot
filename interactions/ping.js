const {MessageEmbed} = require("discord.js");

module.exports = {
    config: {
        description: "Effectue un test de latence (API Discord comprise)",
        category: 'Utils',
        specialPermissions: '',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        forceBotChannel: false,
    }, options: [], run: async (bot, interaction) => {
        let ping, pingBot;
        await interaction.reply("Ping ...", {ephemeral: true});
        await interaction.editReply("Pong ...", {ephemeral: true}).then(async (m) => {
            ping = m["createdTimestamp"] - interaction.createdTimestamp;
            pingBot = bot.ws.ping
        });
        const pingEmbed = new MessageEmbed()
            .setTitle("⚙️ Test de latence ...")
            .setColor("#5865F2")
            .addField(`Latence du bot`, `${ping}ms`, true)
            .addField(`Latence de l'API`, `${pingBot}ms`, true)
            .addField(`Total`, `${ping + pingBot}ms`, false)
            .setFooter({text: `Ping by ${bot.user.username}`});
        await interaction.editReply({embeds: [pingEmbed], ephemeral: true});
    }
}

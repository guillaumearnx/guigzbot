const http = require('http')
const {MessageEmbed} = require("discord.js");
const {reportErr} = require("../utils/functions");
const {CHANNELS} = require("../config.json");

module.exports = {
    config: {
        description: "Affiche des informations sur une adresse IP",
        category: 'Outils',
        specialPermissions: '',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        forceBotChannel: true,
    },
    options: [
        {type: 4, name: "ip", description: "Adresse IP a étudier", required: true}
    ],
    run: async (bot, interaction) => {
        try {
            const ip = interaction.options._hoistedOptions[0].value;
            http.get({hostname: `ip-api.com`, path: `/json/${ip}`, method: "GET"}, async res => {
                let rawdata = '';
                res.on('data', chunck => {
                    rawdata += chunck;
                })
                res.on('end', async () => {
                    const data = JSON.parse(rawdata);
                    if (res.statusCode !== 200) await interaction.reply({
                        content: "Impossible de continuer avec cette IP !",
                        ephemeral: true
                    });
                    if (data.status !== 'success') {
                        const e = new MessageEmbed().setTitle(`Erreur`).setDescription(`${data.message}`).setColor("#FDA111").addField(`Votre recherche`, `${data.query}`);
                        return await interaction.reply({
                            content: "Impossible de continuer avec cette IP !",
                            embeds: [e],
                            ephemeral: true
                        });
                    }
                    const c = new MessageEmbed().setTitle("Recherche d'IP/domaine").setDescription(`Demandé par ${interaction.member} sur l'adresse **${data.query}**`);
                    c.setImage(`http://cache.ip-api.com/${data['lon']},${data['lat']},10`);
                    c.addField(
                        "Informations",
                        `◉ IP : ${data.query}
                        ◉ Ville : ${data["zip"]} - ${data.city}
                        ◉ Pays : ${data['regionName']} / ${data.country}
                        ◉ ASN : ${data['as']}
                        ◉ ISP : ${data['isp']}
                        ◉ ORG : ${data['org']}
                        ◉ TimeZone : ${data['timezone']}`,
                        false);
                    await bot.channels.cache.get(CHANNELS["BOTS_LOGS"]).send(`${interaction.member} à lancé une recherche d'IP sur ${data.query}`)
                    await interaction.reply({embeds: [c], ephemeral: true});
                })
            }).on("error", async err => {
                await reportErr(bot, err, 'Erreur lors d\'une recherche d\'IP')
                await interaction.reply({content: "Impossible de continuer avec cette IP !", ephemeral: true})
            });
        } catch (e) {
            await reportErr(bot, e, 'Erreur lors d\'une recherche d\'IP')
            await interaction.reply({content: "Impossible de continuer avec cette IP !", ephemeral: true})
        }
    }
}

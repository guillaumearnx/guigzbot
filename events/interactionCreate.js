const {addRole} = require('../utils/functions')
const {RECAPTCHA, DISCORD_GUILD_ID} = require("../config.json")

module.exports = async (bot, interaction) => {
    if (!interaction.isButton()) return;
    const member = interaction.member;
    const roleTempo = await bot.guilds.cache.get(`${DISCORD_GUILD_ID}`).roles.cache.get(`${RECAPTCHA["TEMPO_ROLE_ID"]}`);
    switch (interaction.customId) {
        case "reglement":
            if (member.roles.cache.some(role => role.id === `${RECAPTCHA["TEMPO_ROLE_ID"]}`))
                await member.roles.remove(roleTempo)
            if (!member.roles.cache.some(role => role.id === `${RECAPTCHA["VERIFIED_ROLE_ID"]}`))
                await addRole(bot, member)
            await interaction.deferUpdate();
            break;
        default:
            break;
    }
};
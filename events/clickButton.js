const {addRole} = require('../utils/functions')
const {RECAPTCHA, DISCORD_GUILD_ID} = require("../config.json")

module.exports = async (bot, button) => {
    /*const member = button.clicker.member
    const roleTempo = await bot.guilds.cache.get(`${DISCORD_GUILD_ID}`).roles.cache.get(`${RECAPTCHA["TEMPO_ROLE_ID"]}`);
    switch (button.id) {
        case "reglement":
            if (member.roles.cache.some(role => role.id === `${RECAPTCHA["TEMPO_ROLE_ID"]}`))
                await member.roles.remove(roleTempo)
            if (!member.roles.cache.some(role => role.id === `${RECAPTCHA["VERIFIED_ROLE_ID"]}`))
                await addRole(bot, member)
            button.reply.defer()
            break;
        default:
            break;
    }*/
    
};

const {addRole, reportErr, checkOwner} = require('../utils/functions')
const {RECAPTCHA, DISCORD_GUILD_ID, CHANNELS} = require("../config.json")

module.exports = async (bot, interaction) => {
    if (interaction.isButton()) {
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
    }
    if (interaction.isCommand()) {
        const interactionCommand = bot.interactions.get(interaction.commandName);
        const interactionF = require(`../interactions/${interaction.commandName}`);
        const interactionConfig = interactionF.config;
        if (!interactionCommand || !interactionF) return;
        try {
            if (interactionConfig.specialPermissions.toLowerCase() === 'owner' && !await checkOwner(interaction.user.id)) {
                return;
            }
            if (interactionConfig.specialPermissions.toLowerCase() === 'moderator' && !interaction.member.permissions.has('KICK_MEMBERS', true)) {
                return;
            }
            if (!interaction.member.permissions.has('ADMINISTRATOR', true)) {
                if (interactionConfig.specialPermissions.toLowerCase() === 'administrator') {
                    return;
                }
                if (interactionConfig.forceBotChannel && !(CHANNELS["BOTS_COMMANDS"] === interaction.channel.id)) {
                    return;
                }
            }
            await interactionF.run(bot, interaction);
        } catch (error) {
            await reportErr(bot, error, "Erreur lors de l'execution d'une interraction")
            await interaction.reply({content: 'There was an error while executing this command!', ephemeral: true});
        }

    }

};

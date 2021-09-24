const {REST} = require('@discordjs/rest');
const {BOT_TOKEN, BOT_ID, DISCORD_GUILD_ID} = require("../config.json");
// noinspection JSClosureCompilerSyntax,JSCheckFunctionSignatures
const rest = new REST({version: '9'}).setToken(BOT_TOKEN);
const {Routes} = require('discord-api-types/v9');
const {reportErr} = require("../utils/functions");


module.exports = async (bot) => {
    console.info(`\nLogged in as ${bot.user.tag}!`.blue);
    try {
        bot.user.setActivity(bot.maintenance ? 'la maintenance' : 'garnx.fr', {type: "PLAYING"})
    } catch (e) {
        await reportErr(bot, e, "Erreur lors de la gestion des activités")
    }
    try {
        await rest.put(Routes.applicationGuildCommands(BOT_ID, DISCORD_GUILD_ID), {body: Array.from(bot.interactions.values())})
    } catch (err) {
        console.error(err);
        process.exit(-2);
    }
    console.log((`A total of ${bot.interactions.size} (/) commands were loaded.`).green);
}

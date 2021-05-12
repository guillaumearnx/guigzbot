const {MessageEmbed} = require('discord.js')
const {RECAPTCHA, DISCORD_GUILD_ID} = require("../config.json")

async function addRole(bot, discordId) {
    try {
        let guild = await bot.guilds.fetch(DISCORD_GUILD_ID);
        let member = await guild.members.fetch(discordId);
        let role = await guild.roles.cache.find(r => r.id === RECAPTCHA["VERIFIED_ROLE_ID"]);
        await member.roles.add(role)
        await welcomeSend()
    } catch (e) {
        console.log(`Error adding role to user ${discordId}.`);
    }
}

async function welcomeSend(bot, discordId) {
    /*try {
        let welcomeEmbed = new MessageEmbed()
            .addField()
        let guild = await this.bot.guilds.fetch(DISCORD_GUILD_ID)
        let channel = await guild.channels.cache.get(DISCORD_GUILD_ID)
        channel.send(welcomeEmbed);
    } catch (e) {
        console.log(`Error sending welcome message for ${discordId}.`);
    }*/
}

module.exports = {
    addRole,
    welcomeSend
}
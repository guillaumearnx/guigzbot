const {MessageAttachment} = require("discord.js");
const {createCanvas, loadImage} = require("canvas");
const {DISCORD_GUILD_ID, CHANNELS, RECAPTCHA} = require("../config.json")
const path = require('path')

module.exports = async (bot, member) => {
    if(message.guild.roles.cache.find(x => x.id === `${RECAPTCHA["VERIFIED_ROLE_ID"]}`)){
        if (user.roles.cache.has(muterole.id)) { return message.channel.send("T'inquiètes il est déjà mute") }
        const canvas = createCanvas(700, 250)
        const ctx = canvas.getContext('2d')
        const background = await loadImage(
            path.join(__dirname, `../assets/imgs/embedmember/image3.jpg`)
        )
        let x = 0, y = 0;
        ctx.drawImage(background, x, y)
        const pfp = await loadImage(
            member.user.displayAvatarURL({
                format: 'png',
            })
        )
        x = canvas.width / 2 - pfp.width / 2
        y = 25
        ctx.drawImage(pfp, x, y)
        ctx.fillStyle = '#000000'
        let text = `Au revoir ${member.user.tag}!`
        ctx.font = `${ctx.measureText(text).width / 5.3}px sans-serif`
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 60 + pfp.height)
        ctx.font = '32px sans-serif'
        text = `${bot.guilds.cache.get(`${DISCORD_GUILD_ID}`).memberCount} membres`
        x = canvas.width / 2 - ctx.measureText(text).width / 2
        ctx.fillText(text, x, 100 + pfp.height)
        const attachment = new MessageAttachment(canvas.toBuffer())
        await bot.channels.cache.get(CHANNELS["WELCOME_CHANNEL"]).send(`<@${member.id}>`, attachment)
    }
};

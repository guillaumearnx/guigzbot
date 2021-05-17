const {createCanvas, loadImage} = require('canvas')
const path = require('path')
const {MessageAttachment} = require("discord.js");
const {RECAPTCHA, DISCORD_GUILD_ID, OWNERS, CHANNELS} = require("../config.json")

async function addRole(bot, member) {
    try {
        let guild = await bot.guilds.fetch(DISCORD_GUILD_ID);
        let memberFetched = await guild.members.fetch(member.id);
        let role = await guild.roles.cache.find(r => r.id === RECAPTCHA["VERIFIED_ROLE_ID"]);
        await memberFetched.roles.add(role)
        await welcomeSend(bot, member)
    } catch (e) {
        console.log(`Error adding role to user ${member.id}.`);
    }
}

async function welcomeSend(bot, member) {
    const canvas = createCanvas(700, 250)
    const ctx = canvas.getContext('2d')
    const background = await loadImage(
        path.join(__dirname, './imgs/background.png')
    )
    let x = 0
    let y = 0
    ctx.drawImage(background, x, y)
    const pfp = await loadImage(
        member.user.displayAvatarURL({
            format: 'png',
        })
    )
    x = canvas.width / 2 - pfp.width / 2
    y = 25
    ctx.drawImage(pfp, x, y)
    ctx.fillStyle = '#ffffff'
    ctx.font = '35px sans-serif'
    let text = `Bienvenue ${member.user.tag}!`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 60 + pfp.height)
    ctx.font = '30px sans-serif'
    text = `Membre n°${bot.guilds.cache.get(`${DISCORD_GUILD_ID}`).memberCount}`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 100 + pfp.height)
    const attachment = new MessageAttachment(canvas.toBuffer())
    bot.channels.cache.get(CHANNELS["WELCOME_CHANNEL"]).send(`<@${member.id}>`, attachment)
}

async function checkOwner(id) {
    for (let owner of OWNERS) {
        if (owner["ID"] === id) {
            return true;
        }
    }
    return false;
}

module.exports = {
    addRole,
    welcomeSend,
    checkOwner
}
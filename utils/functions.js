const {createCanvas, loadImage} = require('canvas')
const path = require('path')
const {MessageAttachment, MessageEmbed} = require("discord.js");
const {RECAPTCHA, DISCORD_GUILD_ID, OWNERS, CHANNELS} = require("../config.json")
const hastebin = require('hastebin.js');
const haste = new hastebin({url: 'https://paste.garnx.fr'});

async function addRole(bot, member) {
    try {
        let guild = await bot.guilds.fetch(DISCORD_GUILD_ID);
        let memberFetched = await guild.members.fetch(member.id);
        let role = await guild.roles.cache.find(r => r.id === RECAPTCHA["VERIFIED_ROLE_ID"]);
        await memberFetched.roles.add(role)
        await welcomeSend(bot, member)
    } catch (e) {
        console.log(`Error adding role to user ${member.id}.`);
        await reportErr(bot, e, "Petit soucis pendant l'ajout d'un role")
    }
}

async function welcomeSend(bot, member) {
    const canvas = createCanvas(700, 250)
    const ctx = canvas.getContext('2d')
    const background = await loadImage(
        path.join(__dirname, `../assets/imgs/embedmember/image${Math.floor(Math.random() * 3)}.jpg`)
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
    let text = `Bienvenue ${member.user.tag}!`
    ctx.font = `${ctx.measureText(text).width / 5.6}px sans-serif`
    x = canvas.width / 2 - ctx.measureText(text).width / 2
    ctx.fillText(text, x, 60 + pfp.height)
    ctx.font = '28px sans-serif'
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

async function reportErr(bot, err, description) {
    try {
        let errorLink = await haste.post(err);
        console.log(`Error generated for : ${description} -> ${errorLink}`)
        let errEmbed = new MessageEmbed()
            .setTitle("Rapport d'erreur")
            .setDescription(description)
            .addField('Erreur :', errorLink)
            .setFooter(`Error by ${bot.user.username}`, bot.user.displayAvatarURL())
            .setTimestamp()
            .setColor('#dd0000');
        bot.channels.cache.get(`${CHANNELS["BOT_LOGS"]}`).send(`<@!${BOT_OWNER}>`, {embed: errEmbed})
    } catch (erri) {
        console.log("Une erreur est survenue : " + err + "\n -> " + erri)
    }
}

module.exports = {
    addRole,
    welcomeSend,
    checkOwner,
    reportErr
}

// noinspection HttpUrlsUsage

const {MessageEmbed} = require('discord.js');
const {createLink} = require("../utils/pools.js");
const {RECAPTCHA, OWNERS, CHANNELS} = require("../config.json");
const {addRole, welcomeSend} = require("../utils/functions");
const {getRunning} = require("../webserver.js");
const empty = [["", " "], [null, undefined]]

module.exports = async (bot, member) => {
    if (getRunning()) {
        try{
            const linkId = createLink(member.id);
            const embed = new MessageEmbed()
                .setTitle('reCAPTCHA Verification')
                .setDescription(`To gain access to this server you must solve a captcha. The link will expire in 15 minutes.\nhttp://${RECAPTCHA["DOMAIN"] === '' ? `localhost:${RECAPTCHA["PORT"]}` : RECAPTCHA["DOMAIN"]}/verify/${linkId}?sitekey=${RECAPTCHA["RECAPTCHA_SITE_KEY"]}`)
                .setColor('BLUE')
                .setFooter(`ReCaptcha by ${bot.user.username}`, bot.user.displayAvatarURL())
            member.send(embed);
        }catch(err){
            bot.channels.cache.get(CHANNELS["BOT_LOGS"]).send(`<@${OWNERS["ID"]}> | Je n'ai pas réussi à envoyer de message à ${member.user.username}\n${err}`)
        }
    } else {
        if (empty[0].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1 || empty[1].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1) {
            await welcomeSend(bot, member);
        } else {
            await addRole(bot, member)
        }
    }
};

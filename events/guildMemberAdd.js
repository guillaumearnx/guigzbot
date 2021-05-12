// noinspection HttpUrlsUsage

const {MessageEmbed} = require('discord.js');
const {createLink} = require("../utils/pools.js");
const {RECAPTCHA} = require("../config.json");
const {addRole, welcomeSend} = require("../utils/functions");
const {getRunning} = require("../webserver.js");
const empty = [["", " "], [null, undefined]]

module.exports = async (bot, member) => {
    if (getRunning()) {
        const linkId = createLink(member.id);
        const embed = new MessageEmbed()
            .setTitle('reCAPTCHA Verification')
            .setDescription(`To gain access to this server you must solve a captcha. The link will expire in 15 minutes.\nhttp://${RECAPTCHA["DOMAIN"] === '' ? `localhost:${RECAPTCHA["PORT"]}` : RECAPTCHA["DOMAIN"]}/verify/${linkId}?sitekey=${RECAPTCHA["RECAPTCHA_SITE_KEY"]}`)
            .setColor('BLUE')
        member.send(embed);
    } else {
        if (empty[0].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1 || empty[1].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1) {
            await welcomeSend(bot, member.id);
        } else {
            await addRole(bot, member.id)
        }
    }
};
// noinspection HttpUrlsUsage

const {MessageEmbed} = require('discord.js');
const {createLink} = require("../utils/pools.js");
const {RECAPTCHA} = require("../config.json");

module.exports = async (bot, member) => {
    const linkId = createLink(member.id);
    const embed = new MessageEmbed()
        .setTitle('reCAPTCHA Verification')
        .setDescription(`To gain access to this server you must solve a captcha. The link will expire in 15 minutes.\nhttp://${RECAPTCHA["DOMAIN"] === '' ? `localhost:${RECAPTCHA["PORT"]}` : RECAPTCHA["DOMAIN"]}/verify/${linkId}?sitekey=${RECAPTCHA["RECAPTCHA_SITE_KEY"]}`)
        .setColor('BLUE')
    member.send(embed);
};
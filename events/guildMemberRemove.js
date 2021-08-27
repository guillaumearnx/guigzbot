const {goodbyeSend} = require("../utils/functions");
const {RECAPTCHA} = require("../config.json")

module.exports = async (bot, member) => {
    if (member.roles.cache.find(x => x.id === `${RECAPTCHA["VERIFIED_ROLE_ID"]}`)) {
        await goodbyeSend(bot, member);
    }
};

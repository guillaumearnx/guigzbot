const {addRole} = require('../utils/functions')
const {RECAPTCHA} = require("../config.json")

module.exports = async (bot, button) => {
    let member = button.clicker.member
    switch (button.id) {
        case "reglement":
            if (!member.roles.cache.some(role => role.id === RECAPTCHA["VERIFIED_ROLE_ID"]))
                await addRole(bot, button.clicker.member)
            button.defer()
            break;
        default:
            break;
    }
};

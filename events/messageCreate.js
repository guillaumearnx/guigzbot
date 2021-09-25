const {BOT_PREFIX, CHANNELS} = require('../config.json');
const {checkOwner} = require('../utils/functions')

module.exports = async (bot, message) => {
    if (message.author.bot || message.channel.type === 'dm') {
        return;
    }
    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) {
        return;
    }
    if (!message.content.startsWith(BOT_PREFIX)) {
        return;
    }
    let args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();
    let cmd = bot.commands.get(command) || bot.commands.get(bot.aliases.get(command));
    if (cmd) {
        if (cmd.config.specialPermissions.toLowerCase() === 'owner' && !await checkOwner(message.author.id)) {
            return;
        }
        if (cmd.config.specialPermissions.toLowerCase() === 'moderator' && !message.member.permissions.has('KICK_MEMBERS', true)) {
            return;
        }
        if (!message.member.permissions.has('ADMINISTRATOR', true)) {
            if (cmd.config.specialPermissions.toLowerCase() === 'administrator') {
                return;
            }
            if (cmd.config.forceBotChannel && ([CHANNELS["BOT_COMMANDS"], CHANNELS["BOT_PUBLIC_COMMANDS"]].indexOf(message.channel.id) < 0)) {
                return;
            }
        }
        await cmd.run(bot, message, args);
    }
};

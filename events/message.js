const {BOT_PREFIX} = require('../config.json');

module.exports = async (bot, message) => {
    if (message.author.bot || message.channel.type === 'dm') { return; }
    if (!message.channel.permissionsFor(bot.user).has('SEND_MESSAGES')) { return; }
    if (!message.content.startsWith(BOT_PREFIX)) { return; }
    let args = message.content.slice(BOT_PREFIX.length).trim().split(/ +/g);
    let commande = args.shift();
    if (commande.length < 1) { return; }
    let cmd = bot.commands.get(commande);
    if (!cmd) { return; }
    cmd.run(bot, message, args);
};
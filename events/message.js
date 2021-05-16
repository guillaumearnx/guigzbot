const {MessageEmbed} = require("discord.js");
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
    let commande = args.shift();
    if (commande.length < 1) {
        return;
    }
    let cmd = bot.commands.get(commande) || bot.commands.get(bot.aliases.get(commande));
    if (!cmd) {
        return;
    }
    if (cmd.config.category.toLowerCase() === 'owner' && !await checkOwner(message.author.id)) {
        return;
    }
    if (cmd.config.category.toLowerCase() === 'moderation' && !message.member.permissions.has('KICK_MEMBERS', true)) {
        return;
    }
    if(!message.member.permissions.has('ADMINISTRATOR', true)){
        if(cmd.config.category.toLowerCase() === 'administration'){
            return;
        }
        if(cmd.config.forceBotChannel && !(CHANNELS["BOT_COMMANDS"] === message.channel.id)){
            return;
        }
    }
    return cmd.run(bot, message, args)/*.catch(warning => {
        let errEmbed = new MessageEmbed()
            .setDescription('Oh oh ... Un petit soucis est survenu pendant l\'éxecution de la commande : **' + cmd.config.name + '**.')
            .addField('Erreur :', warning.stack)
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setTimestamp()
            .setColor('#dd0000');
        bot.channels.cache.get(CHANNELS["BOTS_LOGS"]).send(errEmbed);
    });*/
}
;
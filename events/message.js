const {MessageEmbed} = require("discord.js");
const {BOT_PREFIX, CHANNELS} = require('../config.json');
const {checkOwner} = require('../utils/functions')
const hastebin = require('hastebin.js');
const haste = new hastebin({url: 'https://paste.garnx.fr'});


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
    if(cmd){
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
    }

    cmd.run(bot, message, args).catch(async (warning) => {
        let err = (warning.stack.length > 1000) ? await haste.post(warning.stack) : warning.stack;
        let errEmbed = new MessageEmbed()
            .setDescription('Oh oh ... Un petit soucis est survenu pendant l\'éxecution de la commande : **' + cmd.config.name + '**.')
            .addField('Erreur :', err)
            .setFooter(bot.user.username, bot.user.displayAvatarURL())
            .setTimestamp()
            .setColor('#dd0000');
        bot.channels.cache.get(`${CHANNELS["BOTS_LOGS"]}`).send(errEmbed);
    });
}
;
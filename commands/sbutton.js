// noinspection JSCheckFunctionSignatures

const {MessageActionRow, MessageButton} = require('discord.js');
const {BOT_PREFIX} = require('../config.json')


module.exports.run = async (bot, message, args) => {
    if (args.length < 2)
        return;
    const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[0])
    if (!channel)
        return;
    let msg = message.content.substring(BOT_PREFIX.length + message.content.substring(0, message.content.indexOf(" ")).length + args[0].length + 1)
    let buttons = [];
    // noinspection CssInvalidHtmlTagReference,CssInvalidPseudoSelector
    message.channel.send(`Vous allez envoyer ${msg.startsWith(' ') ? `\`${msg.substring(1, msg.length)}\` ` : `\`${msg}\` `}dans ${channel}\nPour ajouter un boutton, suivez ceci :\n> Boutton Texte : envoyez **bt "<label>" <style> [emoji] <id>**\n> Boutton URL : envoyez **bu ""<label>" <style> [emoji] <url>**\nVous avez 1 minute pour ajouter vos bouttons dans la limite de 4. Pour passer, envoyez **send**\n*Pour envoyer plusieurs bouttons, utilisez cette syntaxe : \`bt "Lien vers google" LINK :ok: https://google.fr|bt coucou PRIMARY :warning: cc\`*\nListe des <style> disponibles : **A ECRIRE EN MAJUSCULES**`)
    message.channel.send({files: ['assets/imgs/sbutton.png']})
    const item = ["bt", "bu", ""]
    const filter = m => {
        return item.some(answer => answer.toLowerCase() === m.content.substring(0, m.content.indexOf(" ")).replace(/\s/g, '').toLowerCase()) && m.author.id === message.author.id && m.channel.id === message.channel.id;
    };
    message.channel.awaitMessages({max: 1, time: 60000, errors: ['time'], filter: filter}).then(async collected => {
        try {
            let msgCollected = collected.first().content.split('|');
            msgCollected.forEach((msgIndex) => {
                    while (msgIndex.startsWith(" ")) {
                        msgIndex = msgIndex.substring(1, msgIndex.length)
                    }
                    while (msgIndex.endsWith(" ")) {
                        msgIndex = msgIndex.substring(0, msgIndex.length - 1)
                    }
                    let tempInstructions = msgIndex.split(" ")
                    let label = msgIndex.match(/"[^"]*"|^[^"]*$/)[0].replace(/"/g, "");
                    let instructions = []
                    instructions[0] = tempInstructions[0];
                    instructions[1] = label;
                    instructions[2] = tempInstructions[tempInstructions.length - 3]
                    instructions[3] = tempInstructions[tempInstructions.length - 2]
                    instructions[4] = tempInstructions[tempInstructions.length - 1]
                    switch (instructions[0]) {
                        case "bu":
                            buttons.push(new MessageButton().setLabel(instructions[1]).setEmoji(instructions[3]).setStyle(instructions[2]).setURL(instructions[4]))
                            break;
                        case "bt":
                            buttons.push(new MessageButton().setLabel(instructions[1]).setEmoji(instructions[3]).setStyle(instructions[2]).setCustomId(instructions[4]))
                            break;
                        case "":
                        case " ":
                            break;
                    }
                }
            )
            const row = new MessageActionRow()
            for (const btn of buttons) {
                await row.addComponents(btn);
            }
            // noinspection JSCheckFunctionSignatures
            await channel.send({content: msg, components: [row]})
        } catch
            (err) {
            message.channel.send(`Impossible d'effectuer cette action -> ${err}`)
        }
    }).catch((err) => {
        message.channel.send('temps ecoule');
        console.log(err)
    });
}

module.exports.config = {
    category: 'Utils',
    specialPermissions: 'administrator',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['b'],
    forceBotChannel: true,
};

module.exports.help = {
    description: 'Envoie un message stylisé',
    syntax: `sbutton <channel> [Message]`,
    examples: `sbutton 123456789 Salut l'ami`,
};

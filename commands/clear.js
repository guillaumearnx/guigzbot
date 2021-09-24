module.exports.run = async (bot, message, args) => {
    const amount = parseInt(args[0]) || 1;
    if (isNaN(amount) || amount > 99 || amount < 1) return;
    await message.delete();
    setTimeout(async () => {
        await message.channel.bulkDelete(amount).catch(()=>undefined)
    }, 100)

};

module.exports.config = {
    category: 'Administration',
    specialPermissions: 'administrator',
    name: __filename.slice(__dirname.length + 1, __filename.length - 3),
    aliases: ['clr'],
    forceBotChannel: false,
};

module.exports.help = {
    description: 'Supprimer des messages',
    syntax: `clear [nombre]`,
    examples: `clear 5`,
};

module.exports = async (bot) => {
    console.info(`\nLogged in as ${bot.user.tag}!`);
    await bot.user.setActivity('garnx.fr').catch(console.error);
}

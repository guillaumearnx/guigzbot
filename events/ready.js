const { CLIENT } = require("../config.json");
const { deployInteractions, loadInteractions, removeIntegrations } = require("../utils/functions");

module.exports = async (bot) => {
	console.info(`\nLogged in as ${bot.user.tag}!`.blue);
	bot.interactions = await loadInteractions(bot);
	bot.user.setActivity(`${bot.guilds.cache.get(CLIENT["MAIN_GUILD_ID"]).memberCount} members`, { type: "WATCHING" });
	try {
		if (process.env.DEV) {
			await removeIntegrations();
			await deployInteractions(!process.env.DEV, bot.interactions);
		}
		else {
			await deployInteractions(!process.env.DEV, bot.interactions);
		}
	}
	catch (e) {
		console.error(e);
		process.exit(1);
	}
};

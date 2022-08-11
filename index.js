// Dependencies
const { Client, Collection } = require("discord.js");
const { run } = require("npm-check-updates");
const fs = require("fs");
const path = require("path");
require("colors");

// Config check
if (!fs.existsSync("./config.json")) {
	console.error("Please create a config.json".red);
	process.exit(-1);
}
const empty = ["", " ", null, undefined];
const { CLIENT } = require("./config.json");
if (empty.indexOf(CLIENT["TOKEN"]) > -1) {
	console.error("Please set a bot token !".red);
	process.exit(0);
}
if (empty.indexOf(CLIENT["MAIN_GUILD_ID"]) > -1) {
	console.error("Please set your main guild id !".red);
	process.exit(0);
}

// Client
const bot = new Client({
	intents: 32767,
});

bot.aliases = new Collection();
bot.interactions = new Collection();

console.log(("Starting bot...").red);

// Packages
(async () => {
	const r = await run({
		packageFile: "package.json",
	});
	if (Object.keys(r).length > 0) {
		console.log("Some updates are availables".yellow);
		for (const [key, value] of Object.entries(r)) {
			console.log(`${key} -> ${value}`.magenta);
		}
	}
	else {console.log("All packages are up-to-date".magenta);}
})();

// Events
let nbEvents = 0;
fs.readdir("./events/", (err, files) => {
	if (err) return console.error(err);
	console.log(`\n(${files.length}) events`.yellow);
	files.forEach(file => {
		if (!file.endsWith(".js") || file.substring(file.indexOf(path.sep) + 1).startsWith("-")) return;
		nbEvents++;
		const event = require(`./events/${file}`);
		const eventName = file.split(".")[0];
		bot.on(eventName, event.bind(null, bot));
		console.log("\tLoading event : " + `${eventName}`.blue);
	});
	if (nbEvents === 0) console.log("No active events".yellow);
});

// Login to API
bot.login(CLIENT["TOKEN"]).catch(() => {
	console.log("Can't connect ...");
	process.exit(0);
});

// Debug
bot.on("warn", (e) => console.warn(e));
process.on("unhandledRejection", async (error) => {
	console.error(error);
	process.exit(-1);
}).on("uncaughtException", async (error) => {
	console.error(error);
	process.exit(-1);
});

// Export
module.exports = {
	bot,
};

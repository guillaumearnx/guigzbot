//Dépendences
const {Client, Collection} = require('discord.js');
const fs = require('fs');
const recursiveRead = require('recursive-readdir');
const {runWebServer} = require("./webserver.js");
const {BOT_TOKEN, BOT_PREFIX, DISCORD_GUILD_ID} = require('./config.json');
require('colors');
const {reportErr} = require("./utils/functions");

//Verification config
(() => {
    const empty = [["", " "], [null, undefined]]
    if (empty[0].indexOf(BOT_TOKEN) > -1 || empty[1].indexOf(BOT_TOKEN) > -1) {
        console.log("Please set a bot token !");
        process.exit(0);
    }
    if (empty[0].indexOf(BOT_PREFIX) > -1 || empty[1] === BOT_PREFIX) {
        console.log("Please set a prefix !");
        process.exit(0);
    }
    if (empty[0].indexOf(DISCORD_GUILD_ID) > -1 || empty[1] === DISCORD_GUILD_ID) {
        console.log("Please set your main guild id !");
        process.exit(0);
    }
})()

//Variables d'environnement
let nbCommandes = 0;
let nbEvents = 0;

//Variable Client
const bot = new Client();
bot.commands = new Collection();
bot.aliases = new Collection();
console.log(("Lancement du bot ...").brightRed);

//Évenements et commandes
fs.readdir('./events/', (err, files) => {
    if (err) return console.error(err)
    console.log(`\nÉvènements : ` + `(${files.length})`.yellow);
    files.forEach(file => {
        if (!file.endsWith('.js') || file.startsWith('-')) return;
        nbEvents++
        const event = require(`./events/${file}`);
        let eventName = file.split('.')[0];
        bot.on(eventName, event.bind(null, bot))
        console.log(`\tChargement de l'évènement : ` + `${eventName}`.blue);
    })
    if (nbEvents === 0) console.log("Aucun event actif".yellow)
})

// noinspection JSIgnoredPromiseFromCall
recursiveRead('./commandes/', (err, files) => {
    if (err) return console.error(err);
    console.log(`\nCommandes : ` + `(${files.length})`.yellow);
    files.forEach(file => {
        if (!file.endsWith('.js') || file.startsWith('-')) return
        let props = require(`./${file}`);
        let commandName = props.config.name.toLowerCase();
        bot.commands.set(commandName, props);
        props.config.aliases.forEach(alias => {
            bot.aliases.set(alias.toLowerCase(), commandName);
        });
        let aliases = props.config.aliases.map(e => e.toString()).join(", ");
        console.log(`\tChargement de la commande : ` + `${commandName}`.brightRed);
        console.log(`\t\tRaccourcis : ` + `${aliases}`.cyan);
        nbCommandes++;
    })
    if (nbCommandes === 0) console.log("Aucune commande active".yellow)
})

//Script
bot.login(BOT_TOKEN).catch(() => {
    console.log("Can't connect ...");
    process.exit(0);
});
runWebServer(bot);

//Debug
bot.on("warn", (e) => console.warn(e));
bot.on("error", async (e) => await reportErr(bot, e, 'Oh oh ... Un petit soucis est survenu.'));
process.on('unhandledRejection', async (error) => {
    await reportErr(bot, error, "Oh oh ... Un petit soucis est survenu")
});
//bot.on("debug", (e) => console.info(e));

//Export
module.exports = {
    bot
}

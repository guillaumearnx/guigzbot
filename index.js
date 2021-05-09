//Dépendences
const {Client, Collection} = require("discord.js");
const fs = require('fs')
const colors = require('colors')
const recursiveRead = require('recursive-readdir')

//Variables d'environnement
const config = require("./config.json")
let nbCommandes = 0;
let nbEvents = 0;

//Variable Client
const bot = new Client();
bot.website = require("./dashboard/dashboard.js")
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
        let props = require(`./${file}`);
        let filePath = file.replace(/\\/g, "/")
        let commandName = filePath.split(/\//g).reverse()[0];
        if (!commandName.endsWith('.js') || commandName.startsWith('-')) return
        commandName = commandName.split('.')[0];
        bot.commands.set(commandName.toLowerCase(), props);
        props.config.aliases.forEach(alias => {
            bot.aliases.set(alias.toLowerCase(), props.config.name.toLowerCase());
        });
        let aliases = props.config.aliases.map(e => e.toString()).join(", ");
        console.log(`\tChargement de la commande : ` + `${commandName}`.brightRed);
        console.log(`\t\tRaccourcis : ` + `${aliases}`.cyan);
        nbCommandes++;
    })
    if (nbCommandes === 0) console.log("Aucune commande active".yellow)
})


//Script
bot.login(config.token).catch(() => {
    return console.log("Can't connect ...")
});

//Debug
bot.on("warn", (e) => console.warn(e));
//bot.on("debug", (e) => console.info(e));

//Export
module.exports = {bot}
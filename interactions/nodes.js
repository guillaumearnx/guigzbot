const https = require('https')
const {MessageEmbed} = require("discord.js");

const sendInfos = async (nodeNb, interaction, chunck, bot) => {
    const nodes = []
    for (let node of chunck["data"]) {
        node = node.attributes;
        const nodeEmbed = new MessageEmbed().setTitle(`:desktop: ${node.name}`).setDescription(`${node.description} | ${node["maintenance_mode"] ? "**Developpement**" : "**Production**"}`).setThumbnail("https://cdn.icon-icons.com/icons2/534/PNG/128/rack-server-magnifier_icon-icons.com_52826.png").setColor("#AEF1A4").setFooter(`nodes by ${bot.user.tag}`);
        nodeEmbed.addField("ID", `${node.id}`, true)
        nodeEmbed.addField("UUID", `${node['uuid']}`, true)
        nodeEmbed.addField('FQDN', `${node['fqdn']}`, true)
        nodeEmbed.addField("RAM Usage", `${node["allocated_resources"]["memory"]} / ${node["memory"]} MB`, false)
        nodeEmbed.addField("DISK Usage", `${node["allocated_resources"]["disk"]} / ${node["disk"]} MB`, false)
        nodeEmbed.addField("PORT", `${node['daemon_listen']}`, true)
        nodeEmbed.addField("SFTP", `${node['daemon_sftp']}`, true)
        nodes.push(nodeEmbed)
    }
    try {
        await interaction.reply({content: "Voir console !", embeds: ((isNaN(nodeNb)) ? nodes : [nodes[nodeNb - 1]])});
    }catch (err){
        await interaction.reply({content:"Impossible de trouver cette Node", ephemeral:true})
    }
}

module.exports = {
    config: {
        description: "Affiche les informations sur les noeuds GARNX.FR",
        category: 'Administration',
        specialPermissions: 'administrator',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        forceBotChannel: true,
    },
    options: [
        {type: 5, name: "nodeid", description: "Numéro de node", required: false}
    ],
    run: async (bot, interaction) => {
        const options = {
            hostname: 'pterodactyl.garnx.fr',
            port: 443,
            path: '/api/application/nodes',
            method: 'GET',
            headers: {
                "Authorization": "Bearer nEXUXHgzSIG78B2Y2cgjDk3oDBnLh2WaQ3REOO8cHqls2veO"
            },
            json: true
        }
        const req = await https.request(options, res => {
            let chunck;
            res.on('data', d => {
                chunck += d;
            })
            res.on('end', async () => {
                chunck = JSON.parse(chunck.replace('undefined', ''));
                if (interaction.options._hoistedOptions[0])
                    await sendInfos(interaction.options._hoistedOptions[0].value, interaction, chunck, bot);
                else
                    await sendInfos(undefined, interaction, chunck, bot);
            })
        }).on('error', async error => {
            await interaction.reply({
                content: "Impossible de continuer avec cette IP !",
                ephemeral: true
            });
        })
        req.end()
    }
}

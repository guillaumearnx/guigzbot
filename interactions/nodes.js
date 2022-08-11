const { EmbedBuilder } = require("discord.js");
const https = require("https");
const { PTERODACTYL_API_TOKEN } = require("../config.json");

const process = async (interaction, data, client, nodeId = undefined) => {
	const embeds = [];
	for (let node of data["data"]) {
		if (!nodeId || nodeId === node.id) {
			node = node.attributes;
			// noinspection JSCheckFunctionSignatures
			const nodeEmbed = new EmbedBuilder()
				.setTitle(`:desktop: ${node.name}`)
				.setDescription(`${node.description} | ${node["maintenance_mode"] ? "**Developpement**" : "**Production**"}`)
				.setThumbnail("https://cdn.icon-icons.com/icons2/534/PNG/128/rack-server-magnifier_icon-icons.com_52826.png")
				.setColor("#AEF1A4")
				.setFooter({ text: `nodes by ${client.user.tag}` })
				.addFields([
					{ name: "ID", value: `${node.id}`, inline: true },
					{ name: "UUID", value: `${node["uuid"]}`, inline: true },
					{ name: "FQDN", value: `${node["fqdn"]}`, inline: true },
					{
						name: "RAM Usage",
						value: `${node["allocated_resources"]["memory"]} / ${node["memory"]} MB`,
						inline: false,
					},
					{
						name: "DISK Usage",
						value: `${node["allocated_resources"]["disk"]} / ${node["disk"]} MB`,
						inline: false,
					},
					{ name: "PORT", value: `${node["daemon_listen"]}`, inline: true },
					{ name: "SFTP", value: `${node["daemon_sftp"]}`, inline: true },
				]);

			embeds.push(nodeEmbed);
		}
	}
	return embeds;
};


module.exports = {
	config: {
		description: "Informations about infrastructure nodes",
		category: "Adminisration",
		specialPermissions: "owner",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		inBotChannels: true,
	},
	options: [
		{ type: 5, name: "id", description: "Node ID", required: false },
	],
	run: async (client, interaction, options = []) => {
		await interaction.deferReply();
		const data = {
			hostname: "pterodactyl.garnx.fr", port: 443, path: "/api/application/nodes", method: "GET", headers: {
				"Authorization": `Bearer ${PTERODACTYL_API_TOKEN}`,
			}, json: true,
		};
		const req = await https.request(data, res => {
			let response;
			res.on("data", d => {
				response += d;
			});
			res.on("end", async () => {
				response = JSON.parse(response.replace("undefined", ""));
				const nodeId = options.find(o => o.name === "id").value || undefined;
				const embeds = await process(client, interaction, response, nodeId);
				try {
					await interaction.editReply({ embeds: embeds });
				}
				catch (err) {
					await interaction.editReply({ content: `:x: Unable to find node n°${nodeId}`, ephemeral: true });
				}


			});
		}).on("error", async () => {
			await interaction.editReply({
				content: ":x: Error while contacting API..", ephemeral: true,
			});
		});
		req.end();
	},
};
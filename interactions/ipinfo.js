// noinspection JSCheckFunctionSignatures

const { EmbedBuilder } = require("discord.js");
const http = require("http");

module.exports = {
	config: {
		description: "Show information about an IP address",
		category: "Utils",
		specialPermissions: "",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		inBotChannels: true,
	},
	options: [
		{ type: 3, name: "ip", description: "IP Address", required: true },
	],
	run: async (client, interaction, options = []) => {
		await interaction.deferReply({ ephemeral: true });
		try {
			const ip = options.find(o => o.name === "ip").value;
			if (!ip) {
				return interaction.editReply({
					content: "x: Invalid IP",
					ephemeral: true,
				});
			}
			http.get({ hostname: "ip-api.com", path: `/json/${ip}`, method: "GET" }, async res => {
				let rawdata = "";
				res.on("data", chunck => {
					rawdata += chunck;
				});
				res.on("end", async () => {
					const data = JSON.parse(rawdata);
					if (res.statusCode !== 200) {
						await interaction.editReply({
							content: ":x: Unable to deal with this IP address", ephemeral: true,
						});
					}
					if (data.status !== "success") {
						return await interaction.editReply({
							content: `:x: Unable to deal with this IP address **(${data.message})**`, ephemeral: true,
						});
					}
					const c = new EmbedBuilder().setTitle("IP/FQDN Search").setDescription(`Ask by ${interaction.member} on **${data.query}**`);
					c.setImage(`https://cache.ip-api.com/${data["lon"]},${data["lat"]},10`);
					c.addFields([{
						name: "Informations", value: `◉ IP : ${data.query}
                        ◉ City : ${data["zip"]} - ${data["city"]}
                        ◉ Country : ${data["regionName"]} / ${data["country"]}
                        ◉ ASN : ${data["as"]}
                        ◉ ISP : ${data["isp"]}
                        ◉ ORG : ${data["org"]}
                        ◉ TimeZone : ${data["timezone"]}`, inline: false,
					}]);
					await interaction.editReply({ embeds: [c], ephemeral: true });
				});
			}).on("error", async err => {
				console.error(err);
				await interaction.editReply({ content: ":x: Unable to deal with this IP address", ephemeral: true });
			});
		}
		catch (err) {
			console.error(err);
			await interaction.editReply({ content: ":x: Unable to deal with this IP address", ephemeral: true });
		}
	},
};
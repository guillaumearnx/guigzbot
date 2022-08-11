const { EmbedBuilder } = require("discord.js");

module.exports = {
	config: {
		description: "Test the bot latency",
		category: "Utils",
		specialPermissions: "",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		inBotChannels: true,
	},
	options: [],
	run: async (client, interaction) => {
		await interaction.reply("Ping ...", { ephemeral: true });
		const edit = await interaction.editReply("Pong ...", { ephemeral: true });
		const host = edit.createdTimestamp - interaction.createdTimestamp, api = client.ws.ping;
		// noinspection JSCheckFunctionSignatures
		const pingEmbed = new EmbedBuilder()
			.setTitle("⚙️ Latency test ...")
			.setColor("#5865F2")
			.addFields([
				{ name: "Client latency", value: `${host}ms`, inline: true },
				{ name: "API latency", value: `${api}ms`, inline: true },
				{ name: "Total", value: `${host + api}ms`, inline: false },
			])
			.setFooter({ text: `Ping by ${client.user.username}` });
		await interaction.editReply({ embeds: [pingEmbed], ephemeral: true });
	},
};
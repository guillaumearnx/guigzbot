module.exports = {
	config: {
		description: "Delete messages",
		category: "Administration",
		specialPermissions: "moderator",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		inBotChannels: false,
	},
	options: [
		{ type: 4, name: "amount", description: "Amount of messages (1 otherwise)", required: false },
	],
	run: async (client, interaction, options = []) => {
		await interaction.deferReply({ content: ":hourglass: Deleting messages...", ephemeral: true });
		const amount = options.find(o => o.name === "amount") ? options.find(o => o.name === "amount").value : 1;
		if (isNaN(amount) || amount > 99 || amount < 1) {
			return interaction.editReply({
				content: "x: Invalid amount",
				ephemeral: true,
			});
		}
		await interaction.channel.bulkDelete(amount);
		await interaction.editReply({
			content: `:white_check_mark: ${amount} message${amount >= 2 ? "s deleted" : " deleted"}`, ephemeral: true,
		});
	},
};
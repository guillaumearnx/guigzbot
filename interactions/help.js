// noinspection JSCheckFunctionSignatures

const { EmbedBuilder } = require("discord.js");
const { OWNERS } = require("../config.json");

const hasPermission = (member, permission) => {
	switch (permission) {
	case "owner":
		return OWNERS.map(o => `${o["ID"]}`).includes(member.id);
	case "administrator":
		return member.permissions.has("Administrator", true);
	case "moderator":
		return member.permissions.has("ManageMessages", true);
	case "":
		return true;
	default:
		return false;
	}
};

const typeOf = (type) => {
	switch (`${type}`) {
	case "3":
		return "STR";
	case "4":
		return "INT";
	case "5":
		return "BOOL";
	case "6":
		return "USER";
	case "7":
		return "@#";
	case "8":
		return "@&";
	case "9":
		return "@";
	case "10":
		return "NUM";
	case "11":
		return "FILE";
	default:
		return "N/A";
	}
};

module.exports = {
	config: {
		description: "Help command",
		category: "Utils",
		specialPermissions: "",
		name: __filename.slice(__dirname.length + 1, __filename.length - 3),
		inBotChannels: true,
	},
	options: [
		{ type: 3, name: "subcommand", description: "Get help for the specified command", required: false },
	],
	run: async (client, interaction, options = []) => {
		const helpEmbed = new EmbedBuilder().setColor("#4287F5");
		const subcommand = options.find(o => o.name === "subcommand") ? options.find(o => o.name === "subcommand").value : "";
		if (subcommand) {
			const interactionData = client.interactions.find(i => i.config.name === subcommand);
			if (interactionData && hasPermission(interaction.member, interactionData.config.specialPermissions)) {
				helpEmbed.setTitle(`[HELP] ${interactionData.config.name.toUpperCase()}`);
				helpEmbed.setDescription(`<> = Required, [] = Optionnal\nCategory : **${interactionData.config.category}**`);
				helpEmbed.addFields([{ name: "Description", value: interactionData.config.description }]);
				if (interactionData.options.length > 0) {
					helpEmbed.addFields([
						{
							name: "Arguments",
							value: interactionData.options.map(o => `[${typeOf(o.type)}] **${o.name}** : ${o.description}`).join("\n"),
						}]);
				}
			}
			else {return interaction.reply({ content: ":x: Command not found", ephemeral: true });}
		}
		else {
			helpEmbed.setTitle("Commands list :");
			helpEmbed.setFooter({ text: "Try /help `<command>` for detailled information about a command" });
			const categories = new Set(client.interactions.map(interactionData => interactionData.config.category));
			for (const category of categories) {
				let interactions = "";
				client.interactions.forEach(interactionData => {
					if (interactionData.config.category === category && hasPermission(interaction.member, interactionData.config.specialPermissions)) interactions += `**\`${interactionData.config.name}\`** : ${interactionData.config.description}\n`;
				});
				if (interactions.length > 0) {helpEmbed.addFields([{ name: `${category}`, value: `${interactions}` }]);}
			}
		}
		return await interaction.reply({ embeds: [helpEmbed], ephemeral: true });
	},
};
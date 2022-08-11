const { CHANNELS, OWNERS } = require("../config.json");

const handle = async (run, fail) => {
	try {
		await run();
	}
	catch (error) {
		await fail();
	}
};

module.exports = async (bot, interaction) => {
	if (interaction.isChatInputCommand()) {
		const interactionCommand = bot.interactions.get(interaction.commandName);
		const file = require(`../interactions/${interaction.commandName}`);
		if (!interactionCommand || !file) return;
		try {
			if ((file.config["specialPermissions"].toLowerCase() === "owner" && !OWNERS.map(o => `${o["ID"]}`).includes(`${interaction.user.id}`)) || (file.config["specialPermissions"].toLowerCase() === "moderator" && !interaction.member.permissions.has("KICK_MEMBERS", true))) {
				return interaction.reply({ content: ":x: You can't do that !", ephemeral: true });
			}
			if (!interaction.member.permissions.has("Administrator", true)) {
				if (file.config["specialPermissions"].toLowerCase() === "administrator") {
					return interaction.reply({ content: ":x: You can't do that !", ephemeral: true });
				}
				if (file.config["inBotChannels"] && ([CHANNELS["COMMANDS"], CHANNELS["PUBLIC_COMMANDS"]].indexOf(interaction.channel.id) < 0)) {
					return interaction.reply({
						content: `You can't do that here ! ${CHANNELS["COMMANDS"] ? `Try in <#${CHANNELS["PUBLIC_COMMANDS"]}>` : CHANNELS["PUBLIC_COMMANDS"] ? `Try in <#${CHANNELS["COMMANDS"]}>` : ""}`,
						ephemeral: true,
					});
				}
			}
			await file.run(bot, interaction, interaction.options._hoistedOptions);
		}
		catch (error) {
			console.error(error);
			const data = {
				content: ":x: There was an error while executing this command !", ephemeral: true,
			};
			await handle(() => interaction.reply(data), () => interaction.editReply(data));
		}
	}
	/* if (interaction.isButton()) {
        const member = interaction.member;
        const roleTempo = await bot.guilds.cache.get(`${DISCORD_GUILD_ID}`).roles.cache.get(`${RECAPTCHA["TEMPO_ROLE_ID"]}`);
        switch (interaction.customId) {
            case "reglement":
                if (member.roles.cache.some(role => role.id === `${RECAPTCHA["TEMPO_ROLE_ID"]}`)) await member.roles.remove(roleTempo)
                if (!member.roles.cache.some(role => role.id === `${RECAPTCHA["VERIFIED_ROLE_ID"]}`)) await addRole(bot, member)
                await interaction.deferUpdate();
                break;
            default:
                break;
        }
    }*/
};
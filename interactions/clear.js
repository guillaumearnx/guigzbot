module.exports = {
    config: {
        description: "Supprime un nombre de messages donnés (1 sinon)",
        category: 'Administration',
        specialPermissions: 'moderator',
        name: __filename.slice(__dirname.length + 1, __filename.length - 3),
        forceBotChannel: false,
    },
    options: [
        {type: 5, name: "amount", description: "Nombre de messages a supprimer", required: false}
    ],
    run: async (bot, interaction) => {
        const amount = interaction.options._hoistedOptions[0] ? interaction.options._hoistedOptions[0].value : 1;
        if (isNaN(amount) || amount > 99 || amount < 1) return;
        setTimeout(async () => {
            await interaction.channel.bulkDelete(amount).catch(() => undefined)
            await interaction.reply({
                content: `${amount} message${amount >= 2 ? "s ont été supprimés" : ' a été supprimé'}`, ephemeral: true
            });
        }, 1000);
    }
}

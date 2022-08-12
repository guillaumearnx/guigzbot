const { goodbye } = require("../utils/functions");

module.exports = async (bot, member) => {
	await goodbye(bot, member);
};

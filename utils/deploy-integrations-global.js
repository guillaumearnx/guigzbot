const { deployInteractions } = require("./functions");

deployInteractions(true).catch(e => console.error(e));
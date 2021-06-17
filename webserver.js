const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const {isValidLink, getDiscordId, removeLink} = require("./utils/pools");
const {addRole} = require("./utils/functions");
const {RECAPTCHA, DISCORD_GUILD_ID} = require("./config.json");
let running = false, botTarget;

const app = express();
app.use(express.static(path.join(__dirname, '/utils/captcha')))
app.use(bodyParser.urlencoded({extended: true}));

app.get('/verify/:verifyId?', (req, res) => {
    // noinspection JSUnresolvedVariable
    if (!req.params.verifyId || !isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, './utils/captcha/html/invalidLink.html'));
    res.sendFile(path.join(__dirname, `./utils/captcha/html/verify.html`));
})

app.post('/verify/:verifyId?', async (req, res) => {
    const response = await axios({
        method: 'post',
        url: `https://www.google.com/recaptcha/api/siteverify?secret=${RECAPTCHA["RECAPTCHA_SECRET_KEY"]}&response=${req.body['g-recaptcha-response']}`,
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        }
    })

    if (!response.data.success) return res.sendFile(path.join(__dirname, './utils/captcha/html/invalidCaptcha.html'));
    // noinspection JSUnresolvedVariable
    if (!isValidLink(req.params.verifyId)) return res.sendFile(path.join(__dirname, './utils/captcha/html/invalidLink.html'));

    // noinspection JSUnresolvedVariable
    await addRole(botTarget, botTarget.guilds.cache.get(`${DISCORD_GUILD_ID}`).members.cache.get(getDiscordId(req.params.verifyId)));

    // noinspection JSUnresolvedVariable
    removeLink(req.params.verifyId);
    res.sendFile(path.join(__dirname, './utils/captcha/html/valid.html'));
})

function runWebServer(bot) {
    botTarget = bot
    //Verification config
    const empty = [["", " "], [null, undefined]]
    const value = ["Y", "F", "TRUE", "YES", "ON"]
    if (empty[1].includes(RECAPTCHA["ACTIVE"]) || !value.includes(RECAPTCHA["ACTIVE"].toUpperCase())) {
        console.log("ReCaptcha active parameter is not correct or set to false, disabling auth....")
        return;
    }
    if (empty[0].includes(RECAPTCHA["RECAPTCHA_SITE_KEY"]) || empty[1].includes(RECAPTCHA["RECAPTCHA_SITE_KEY"])) {
        console.log("No valid RECAPTCHA V2 SITE KEY, disabling auth...");
        return;
    }
    if (empty[0].includes(RECAPTCHA["RECAPTCHA_SITE_KEY"]) || empty[1].includes(RECAPTCHA["RECAPTCHA_SITE_KEY"])) {
        console.log("No valid RECAPTCHA V2 SITE KEY, disabling auth...");
        return;
    }
    if (empty[0].includes(RECAPTCHA["RECAPTCHA_SECRET_KEY"]) || empty[1].includes(RECAPTCHA["RECAPTCHA_SECRET_KEY"])) {
        console.log("No valid RECAPTCHA V2 SECRET KEY, disabling auth...");
        return;
    }
    if (empty[0].indexOf(RECAPTCHA["PORT"]) > -1 || empty[1].indexOf(RECAPTCHA["PORT"]) > -1) {
        console.log("No valid port, disabling auth...");
        return;
    }
    if (empty[0].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1 || empty[1].indexOf(RECAPTCHA["VERIFIED_ROLE_ID"]) > -1) {
        console.log("No valid verified role ID, disabling auth...");
        return;
    }
    running = true;
    app.listen(RECAPTCHA["PORT"], () => console.log(`[Captcha Dash] Listening on port ${RECAPTCHA["PORT"]}.`));
}

function getRunning() {
    return running;
}

module.exports = {
    runWebServer,
    getRunning
}

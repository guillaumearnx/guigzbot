const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const axios = require('axios');
const {isValidLink, getDiscordId, removeLink} = require("./utils/pools");
const {addRole} = require("./utils/functions");
const {RECAPTCHA} = require("./config.json");

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
   await addRole(getDiscordId(req.params.verifyId));

    // noinspection JSUnresolvedVariable
    removeLink(req.params.verifyId);
    res.sendFile(path.join(__dirname, './utils/captcha/html/valid.html'));
})

function runWebServer(bot) {
    app.listen(RECAPTCHA["PORT"], () => console.log(`[Captcha Dash] Listening on port ${RECAPTCHA["PORT"]}.`));
    this.bot = bot;
}

module.exports = {
    runWebServer
}
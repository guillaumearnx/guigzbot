const crypto = require('crypto');
let linkPool = [];

function createLink(discordId) {
    let id = crypto.randomBytes(4).toString('hex');
    linkPool.push({
        discordId: discordId,
        linkId: id
    })
    setTimeout(function () {
        if (isValidLink(id)) removeLink(id);
    }, 900000)
    return id;
}

function isValidLink(link) {
    for (let i = 0; i < linkPool.length; i++)
        if (linkPool[i].linkId === link) return true;
    return false;
}

function removeLink(link) {
    for (let i = 0; i < linkPool.length; i++)
        if (linkPool[i].linkId === link) delete linkPool[i];
    linkPool = linkPool.filter(n => n);
}

function getDiscordId(link) {
    for (let i = 0; i < linkPool.length; i++)
        if (linkPool[i].linkId === link) return linkPool[i].discordId;
    return false;
}

module.exports = {
    createLink,
    isValidLink,
    removeLink,
    getDiscordId
}
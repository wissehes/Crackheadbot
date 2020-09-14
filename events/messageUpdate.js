const Snipe = require("../db/models/Snipe")

module.exports = (client, oldMessage, newMessage) => {
    if (oldMessage.author.bot) return;
    new Snipe({
        userID: oldMessage.author.id,
        channelID: oldMessage.channel.id,
        message: oldMessage.content,
        type: "edit"
    }).save()
}
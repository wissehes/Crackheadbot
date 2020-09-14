const Snipe = require("../db/models/Snipe")

module.exports = (client, oldMessage, newMessage) => {
    new Snipe({
        userID: oldMessage.author.id,
        channelID: oldMessage.channel.id,
        message: oldMessage.content,
        type: "edit"
    }).save()
}
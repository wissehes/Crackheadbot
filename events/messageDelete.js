const Snipe = require("../db/models/Snipe")

module.exports = async (client, message) => {
    new Snipe({
        userID: message.author.id,
        channelID: message.channel.id,
        message: message.content,
        type: "delete"
    }).save()
}
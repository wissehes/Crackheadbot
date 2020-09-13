const Snipe = require("../db/models/Snipe")
const { MessageEmbed } = require("discord.js")

exports.run = async (client, message, args, settings) => {
    const snipes = await Snipe.find({
        channelID: message.channel.id,
        type: "delete"
    })
    if (snipes.length > 5) {
        snipes.splice(5, snipes.length - 1)
    }
    if (snipes.length) {
        const embed = new MessageEmbed()
            .setTitle("Available snipes")
            .setAuthor(`#${message.channel.name}`)
            .setColor("RANDOM")
            .setDescription(snipes.map(sni => {
                const user = client.users.resolve(sni.userID)
                return `**${user.tag}**: ${sni.message}`
            }).join("\n"))
        message.channel.send(embed)
    } else {
        message.channel.send("There's nothing to snipe!")
    }
}
exports.info = {
    name: "snipe",
    aliases: []
}
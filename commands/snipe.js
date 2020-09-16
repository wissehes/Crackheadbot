const Snipe = require("../db/models/Snipe")
const { MessageEmbed } = require("discord.js")
const Moment = require('moment');

exports.run = async (client, message, args, settings) => {
    const channel = message.mentions.channels.first() || message.channel
    const snipes = await Snipe.find({
        channelID: channel.id,
    })

    if (snipes.length) {
        const sortedSnipes = snipes.sort((a, b) => new Date(b.date) - new Date(a.date))

        if (sortedSnipes.length > 5) {
            sortedSnipes.splice(5, sortedSnipes.length - 1)
        }
        const embed = new MessageEmbed()
            .setTitle("Available snipes")
            .setAuthor(`#${channel.name}`)
            .setColor("RANDOM")
        sortedSnipes.forEach((snipe, i) => {
            const members = message.guild.members.resolve(snipe.userID)
            const moment = new Moment(snipe.date)
            const fromNow = moment.fromNow()
            embed.addField(`\`#${i + 1}\` (${snipe.type}) ${members.nickname || members.user.tag} ${fromNow}:`, snipe.message)
        })
        message.channel.send(embed)
    } else {
        message.channel.send("yall- theres nothing left")
    }
}
exports.info = {
    name: "snipe",
    aliases: []
}
const { MessageEmbed } = require("discord.js")
const getMention = require("../functions/getMention")

module.exports = {
    run: (client, message, args) => {
        const member = args.length
            ? getMention(message, args.join(" ").toLowerCase())
            : message.member
        const youOrThey = args.length
            ? "They"
            : "You"
        if (member) {
            const presence = member.presence
            const spotify = presence.activities.find(a => a.name == "Spotify")
            if (spotify) {
                const embed = new MessageEmbed()
                    .setTitle(`${member.user.tag}'s Spotify`)
                    .setColor("RANDOM")
                    .setDescription(`**${spotify.details}** by ${spotify.state}`)
                    .setThumbnail(spotify.assets.largeImageURL({ format: "png" }))
                message.channel.send(embed)

            } else {
                message.reply(`${youOrThey}'re not listening to Spotify 👁👄👁`)
            }
        } else {
            message.reply("i couldnt find that user tho-")
        }
    }
}
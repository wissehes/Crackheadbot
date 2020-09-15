const { MessageEmbed } = require("discord.js")
const XP = require("../db/models/XP")

exports.run = async (client, message, args, settings) => {
    if (!settings.levels) {
        return message.channels.send("💀 Levels are disabled-")
    }
    const serverXP = await XP.find({
        guildID: message.guild.id
    })
    const sortedXP = serverXP.sort((a, b) => a.xp + b.xp)

    if (sortedXP.length > 10) {
        sortedXP.splice(10, sortedXP.length - 1)
    }

    const embed = new MessageEmbed()
        .setTitle(`${message.guild.name} leaderboard`)
        .setDescription("This is the top 10 of most xp in this server")
        .setColor("RANDOM")

    sortedXP.forEach((x, i) => {
        const doesMemberExist = message.guild.members.resolve(x.userID)
        const member = doesMemberExist ? doesMemberExist.user.tag : `**unknown** (user id: ${x.userID})`
        embed.addField(`${i + 1}. ${member}`, `Level ${x.level} - ${x.xp} xp`)
    })
    message.channel.send(embed)
}
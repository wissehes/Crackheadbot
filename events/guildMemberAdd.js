const Guild = require("../db/models/Guild")
const Discord = require("discord.js")

module.exports = async (client, member) => {
    const settings = await Guild.findOne({
        id: member.guild.id
    })

    if (settings.memberJoinedMessages) {
        try {
            const channel = client.channels.resolve(settings.memberJoinedChannel)
            if (channel) {
                try {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`New member joined!`)
                        .setDescription(`${member} joined!`)
                        .setColor("RANDOM")
                        .setThumbnail(member.user.displayAvatarURL())
                        .addField(`Welcome!`, settings.memberJoinedMessage)
                    channel.send(embed)
                } catch (e) {
                    console.error(`Couldn't send welcome message to ${channel.name} in ${member.guild.name}`)
                    console.error(e)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
}
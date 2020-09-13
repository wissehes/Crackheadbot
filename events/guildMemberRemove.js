const Discord = require('discord.js')
const Moment = require('moment');
const Guild = require("../db/models/Guild")

module.exports = async (_client, member) => {
    const settings = await Guild.findOne({ id: member.guild.id })

    if (settings.memberLeftMessages) {
        const channel = member.guild.channels.resolve(settings.memberLeftChannel)
        if (channel) {
            try {
                const moment = new Moment(member.joinedAt)
                const joinedDate = moment.format('DD MMM, YYYY | h:mm a')
                const fromNow = moment.fromNow()

                const embed = new Discord.MessageEmbed()
                    .setTitle(`Someone left!`)
                    .setDescription(`${member.user.tag} left!`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .addField(`Joined at`, `${joinedDate}, ${fromNow}`)

                channel.send(embed)
            } catch (e) {
                console.error(`Couldn't send member left message to ${channel.name} in ${member.guild.name}`)
                console.error("Because:")
                console.error(e)
            }
        }
    }
}
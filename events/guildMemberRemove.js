const Discord = require('discord.js')
var Moment = require('moment');

module.exports = (guild, member) => {
    const moment = new Moment(member.joinedAt)
    const joinedDate = moment.format('DD MMM, YYYY | h:mm a')
    const fromNow = moment.fromNow()
    guild.channels.resolve('669934302716231691')
        .send(new Discord.MessageEmbed()
            .setTitle(`Someone left!`)
            .setDescription(`${member.user.tag} left!`)
            .setThumbnail(member.user.displayAvatarURL())
            .addField(`Joined at`, `${joinedDate}, ${fromNow}`)
        )
}
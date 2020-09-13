const { MessageEmbed } = require("discord.js")
const XP = require("../db/models/XP")

exports.run = async (client, message, args, settings) => {
    const pointsEmbed = async (member) => {
        const userXP = await XP.findOne({
            userID: member.id,
            guildID: message.guild.id
        })
        let embed;
        if (userXP) {
            embed = new MessageEmbed()
                .setColor("RANDOM")
                .setTitle(`${member.nickname || member.user.username}'s XP`)
                .setDescription(`
**XP**: ${userXP.xp}
**Level**: ${userXP.level}
`)
        }
        return userXP ? embed : `${member.user.tag} doesn't have any xp yet`;
    }


    if (!args.length) {
        message.channel.send(await pointsEmbed(message.member))
    } else if (args[0]) {
        if (message.mentions.users.first()) {
            const user = message.guild.members.resolve(message.mentions.users.first().id)
            message.channel.send(await pointsEmbed(user))
        } else {
            const search = args.slice(0).join(" ").toLowerCase();
            const filteredUsers = message.guild.members.cache.filter(u => !u.user.bot)
            let user =
                filteredUsers.find(u => u.user.tag.toLowerCase().includes(search)) ||
                filteredUsers.find(u => u.nickname ? u.nickname.toLowerCase().includes(search) : false) ||
                filteredUsers.find(u => u.id == search)

            if (user) {
                message.channel.send(await pointsEmbed(user))
            } else {
                message.channel.send("User not found!")
            }
        }
    }
}

exports.info = {
    name: "xp",
    aliases: [
        "levels",
        "points",
        "rank"
    ]
}
const {
    MessageAttachment,
    MessageEmbed
} = require("discord.js")

const XP = require("../db/models/XP")
const canvacord = require("canvacord");

const {
    calculateNeededXP,
    calculateXPForLevel
} = require("../functions/rankFunctions")

exports.run = async (client, message, args, settings) => {
    const pointsEmbed = async (member) => {
        const userXP = await XP.findOne({
            userID: member.id,
            guildID: message.guild.id
        })
        let level;
        if (userXP) {
            const neededXP = calculateNeededXP(userXP.xp)
            const currentXP = userXP.xp - calculateXPForLevel(userXP.level)
            const rank = await XP.getRank(userXP)
            if (message.guild.me.hasPermission("ATTACH_FILES")) {
                level = await canvacord.rank({
                    username: member.user.username,
                    discrim: member.user.discriminator,
                    level: userXP.level,
                    rank: rank,
                    neededXP: neededXP,
                    currentXP: currentXP,
                    avatarURL: member.user.displayAvatarURL({ format: "png" }),
                    color: "white",
                });
                levelImage = new MessageAttachment(image, "rank.png");
            } else {
                level = new MessageEmbed()
                    .setColor("RANDOM")
                    .setTitle(`${member.nickname || member.user.username}'s XP`)
                    .setThumbnail(member.user.displayAvatarURL())
                    .setDescription(`
**Rank**: #${rank}
**XP**: ${currentXP}
**Level**: ${userXP.level}
**XP Required to level up**: ${neededXP}
`)
            }
        }
        return userXP ? level : `${member.user.tag} doesn't have any xp yet`;
    }

    // Display a "<name> is typing..." in discord while generating the image
    message.channel.startTyping()

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
    message.channel.stopTyping()

    // Set a timer so it always stops typing.
    setTimeout(() => message.channel.stopTyping(), 1000)
}

exports.info = {
    name: "xp",
    aliases: [
        "levels",
        "points",
        "rank"
    ]
}
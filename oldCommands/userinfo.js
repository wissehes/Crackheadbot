const { MessageEmbed } = require("discord.js")
const Moment = require("moment-timezone")
const getMention = require("../functions/getMention")

exports.run = (client, message, args) => {
    const member = args.length
        ? getMention(message, args.join(" ").toLowerCase())
        : message.member

    if (!member) {
        return message.reply("i couldnt find anyone 😭")
    }

    const info = {
        "Name": member.user.tag,
        "Server nickname": member.nickname || "*none*",
        "User ID": member.id,
        "User type": member.user.bot ? "Bot" : "User",
        "Status": getStatusEmoji(member.presence.status),
        "Joined server": formatDate(member.joinedAt),
        "User created": formatDate(member.user.createdAt)
    }

    const mapped = Object.keys(info).map(t => `• **${t}**: ${info[t]}`)

    const embed = new MessageEmbed()
        .setTitle(member.nickname || member.user.username)
        .setColor(member.displayHexColor)
        .setThumbnail(member.user.displayAvatarURL())
        .addField("User", mapped.join("\n"))

    message.channel.send(embed)
}

function formatDate(date) {
    const m = new Moment(date)
    return `${m.tz('Europe/Amsterdam').format("lll z")} (${m.fromNow()})`
}

function getStatusEmoji(status) {
    switch (status) {
        case "online":
            return "🟢 Online"
            break;
        case "idle":
            return "🟠 Idle"
            break;
        case "dnd":
            return "🔴 Do not disturb"
            break;
        case "offline":
            return "⚪️ Offline"
            break;
    }
}
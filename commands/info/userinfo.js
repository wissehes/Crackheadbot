const Command = require("../../classes/BaseCommand");
const Moment = require("moment-timezone");
const { MessageEmbed } = require("discord.js");

module.exports = class UserinfoCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'userinfo',
            aliases: [],
            group: 'info',
            memberName: 'userinfo',
            description: 'Get information about a user',
            examples: [
                "userinfo @user",
            ],
            guildOnly: true,
            args: [{
                key: "member",
                type: "member",
                default: msg => msg.member,
                prompt: "Whose information do you want to see?"
            }]
        });
    }

    run(message, { member }) {

        const info = {
            "Name": member.user.tag,
            "Server nickname": member.nickname || "*none*",
            "User ID": member.id,
            "User type": member.user.bot ? "Bot" : "User",
            "Status": this.getStatusEmoji(member.presence.status),
            "Joined server": this.formatDate(member.joinedAt),
            "User created": this.formatDate(member.user.createdAt)
        }

        const mapped = Object.keys(info).map(t => `• **${t}**: ${info[t]}`)

        const embed = new MessageEmbed()
            .setTitle(member.nickname || member.user.username)
            .setColor(member.displayHexColor)
            .setThumbnail(member.user.displayAvatarURL())
            .addField("User", mapped.join("\n"))

        message.embed(embed)
    }

    formatDate(date) {
        const m = new Moment(date)
        return `${m.tz('Europe/Amsterdam').format("lll z")} (${m.fromNow()})`
    }

    getStatusEmoji(status) {
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
}
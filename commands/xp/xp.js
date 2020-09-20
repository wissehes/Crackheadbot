const Command = require("../../classes/BaseCommand")
const getMention = require("../../functions/getMention")
const canvacord = require("canvacord")

const {
    MessageAttachment,
    MessageEmbed
} = require("discord.js")

const {
    calculateNeededXP,
    calculateXPForLevel
} = require("../../functions/rankFunctions")

module.exports = class XPCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'xp',
            aliases: [
                'levels',
                'level',
                'rank'
            ],
            group: 'xp',
            memberName: 'xp',
            description: 'Shows your xp and rank.',
            guildOnly: true,
            args: [
                {
                    key: 'mention',
                    prompt: 'Whose XP would you like to see?',
                    type: 'string',
                    default: ""
                },
            ],
        });
    }

    async run(message, { mention }) {
        const member = mention
            ? getMention(message, mention.toLowerCase())
            : message.member

        if (!member) {
            return message.reply("they don't exist- 🥱")
        }

        message.channel.startTyping()

        const picOrEmbed = await getEmbedOrPicture(message, member, this.XP)

        switch (picOrEmbed.type) {
            case "image":
                message.channel.send(picOrEmbed.mOrEmbed)
                break;
            case "embed":
                message.embed(picOrEmbed.embed)
                break;
            case "text":
                message.say(picOrEmbed.message)
                break;
        }

        message.channel.stopTyping()
    }
};

async function getEmbedOrPicture(message, member, XP) {
    const userXP = await XP.findOne({
        userID: member.id,
        guildID: message.guild.id
    })

    let level;
    let type;

    if (userXP) {
        const currentXP = userXP.xp - calculateXPForLevel(userXP.level)
        const neededXP = calculateNeededXP(userXP.xp) + currentXP

        const rank = await XP.getRank(userXP)

        if (message.guild.me.hasPermission("ATTACH_FILES")) {
            type = "image"
            image = await canvacord.rank({
                username: member.user.username,
                discrim: member.user.discriminator,
                level: userXP.level.toString(),
                rank: rank.toString(),
                neededXP: neededXP.toString(),
                currentXP: currentXP.toString(),
                avatarURL: member.user.displayAvatarURL({ format: "png" }),
                color: "white",
            });
            level = new MessageAttachment(image, "rank.png");
        } else {
            type = "embed"
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
    return userXP ? {
        type,
        mOrEmbed: level
    } : {
            type: "text",
            message: `${member.user.tag} doesn't have any xp yet`
        };
}
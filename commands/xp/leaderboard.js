const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const { rankEmoji } = require("../../util/xp")

module.exports = class LeaderboardCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'leaderboard',
            aliases: [],
            group: 'xp',
            memberName: 'leaderboard',
            description: 'Shows the members with the highest amount of XP',
            guildOnly: true,
        });
    }
    async run(message) {
        const settings = await this.getSettings(message.guild)

        if (!settings.levels) {
            return message.say("💀 Levels are disabled-")
        }

        // Get all users in the guild
        let allXP = await this.XP.find({ guildID: message.guild.id })
        // Filter all users that are still in the guild
        allXP = allXP.filter(u => message.guild.members.resolve(u.userID))
        // Sort the users by amount of XP
        allXP = allXP.sort((a, b) => b.xp - a.xp)

        // Show only the top 10; splice all others
        if (allXP.length > 10) {
            allXP.splice(10, allXP.length - 1)
        }

        // Create the base of the actual embed
        const embed = new MessageEmbed()
            .setTitle(`${message.guild.name} leaderboard`)
            .setDescription("This is the top 10 of people with the most xp yall 😳")
            .setColor("RANDOM")

        // Add the top 10 users to the embed
        allXP.forEach((x, i) => {
            const member = message.guild.members.resolve(x.userID).user.tag

            embed.addField(`${rankEmoji(i + 1)} ${i + 1}. ${member}`, `Level ${x.level} - ${x.xp} xp`)
        })

        // Add a footer to the embed that congratulates the suser with the most XP
        const topMember = message.guild.members.resolve(allXP[0].userID).user.username
        embed.setFooter(`Congratulations ${topMember}!!!!`)

        // Send the embed
        message.embed(embed)
    }
}
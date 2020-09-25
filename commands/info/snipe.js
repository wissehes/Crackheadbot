const Command = require("../../classes/BaseCommand");
const Moment = require("moment");
const { MessageEmbed } = require("discord.js");

module.exports = class SnipeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'snipe',
            aliases: [],
            group: 'info',
            memberName: 'snipe',
            description: 'Snipe deleted and edited messages 😳 ✋',
            guildOnly: true,
            args: [{
                key: "channel",
                type: "channel",
                default: msg => msg.channel,
                prompt: "Which channel's snipes do you want to see?"
            }]
        });
    }
    async run(message, { channel }) {
        const snipes = await this.client.snipes.getSnipes(channel)

        if (snipes.length) {
            const sortedSnipes = snipes.sort((a, b) => new Date(b.date) - new Date(a.date))

            if (sortedSnipes.length > 5) {
                sortedSnipes.splice(5, sortedSnipes.length - 1)
            }

            const embed = new MessageEmbed()
                .setTitle("Available snipes")
                .setAuthor(`#${channel.name}`)
                .setColor("RANDOM")

            sortedSnipes.forEach((snipe, i) => {
                const members = message.guild.members.resolve(snipe.userID)
                const moment = new Moment(snipe.date)
                const fromNow = moment.fromNow()
                embed.addField(`\`#${i + 1}\` (${snipe.type}) ${members.nickname || members.user.tag} ${fromNow}:`, snipe.message)
            })

            message.embed(embed)
        } else {
            message.say("chile- there are no snipes anymore 🥱")
        }
    }
}
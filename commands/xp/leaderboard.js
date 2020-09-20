const Command = require("../../classes/BaseCommand");

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
    }
}
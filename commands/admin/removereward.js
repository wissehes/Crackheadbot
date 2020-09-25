const { Argument } = require("discord.js-commando");
const Command = require("../../classes/BaseCommand");

const {
    allRewards,
    displayRole,
    generateEmbed
} = require("../../util/rewards")

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'removereward',
            aliases: [],
            group: 'admin',
            memberName: 'removereward',
            description: '🎁 Remove a level reward',
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            examples: ["removereward", "removereward @role 1"],
            guildOnly: true
        });
    }
    async run(message) {
        const rewards = await this.client.rewards.getAllRewards(message.guild)

        const allRewardsEmbed = allRewards(message, rewards)

        await message.embed(allRewardsEmbed.embed)

        if (allRewardsEmbed.isEmpty) return;

        const myArg = new Argument(this.client, {
            prompt: "Which role do you want to remove? (send the number)",
            type: "integer",
            key: "rewardNumber",
            validate: (v) => {
                if (v > 0 && v <= rewards.length) {
                    return true;
                } else return "That's not a valid reward- send the number in front of the reward."
            }
        })

        const { value } = await myArg.obtain(message)

        if (!value) return;

        const selectedReward = rewards[value - 1]

        try {
            await selectedReward.remove()
            const embed = generateEmbed({
                type: "removed",
                role: displayRole(message, selectedReward.roleID).toString(),
                level: selectedReward.level
            })

            message.embed(embed)
        } catch (e) {
            console.error("An error while removing a role reward")
            console.error(e)

            const embed = generateEmbed({
                type: "error"
            })

            message.embed(embed)
        }
    }
}

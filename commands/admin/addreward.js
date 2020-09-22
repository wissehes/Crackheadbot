const Command = require("../../classes/BaseCommand");

const {
    generateEmbed
} = require("../../util/rewards")

module.exports = class RewardsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'addreward',
            aliases: [],
            group: 'admin',
            memberName: 'reward',
            description: '🎁 Add a level reward',
            clientPermissions: ["MANAGE_ROLES"],
            userPermissions: ["MANAGE_ROLES"],
            examples: ["addreward", "addreward @role 1"],
            args: [
                {
                    key: "role",
                    prompt: "Which role should be rewarded?",
                    type: "role",
                }, {
                    key: "level",
                    prompt: "At which level should this role be rewarded?",
                    type: "integer"
                }
            ]
        });
    }
    async run(message, args) {
        this.client.rewards.addGuildReward(message.guild, args.role, args.level)
            .then(success => {
                if (success) {
                    const embed = generateEmbed({
                        role: this.displayRole(message, args.role.id),
                        level: args.level,
                        type: "created"
                    })

                    message.embed(embed)
                }
            })
            .catch((e) => {
                console.error(e)
                const embed = generateEmbed({
                    type: "error",
                })

                message.embed(embed)
            })
    }

    displayRole = (message, roleID) => {
        const role = message.guild.roles.resolve(roleID) || "**Not Found**"
        return role
    }
}
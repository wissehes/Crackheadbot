const { Role, MessageEmbed, Message } = require("discord.js")

/**
 * 
 * @param {Message} message Message object
 * @param {String} roleID Role id
 */
function displayRole(message, roleID) {
    const role = message.guild.roles.resolve(roleID) || "**Not Found**"
    return role
}

module.exports = {
    /**
     * 
     * @param {String} type Type of embed
     * @param {Role} role Embed role (if any)
     * @param {Number} level Reward level 
     */
    generateEmbed({
        type = "created" || "removed" || "error",
        role = Role,
        level = 0,
    }) {
        const titles = {
            created: "🎉 New reward created!",
            removed: "🗑️ Reward removed!",
            error: "⚠️ An error occurred!"
        }
        const descriptions = {
            created: "You just created a new reward with these settings:",
            removed: "You just removed the following reward!",
            error: "An error occurred while trying to save your new reward. Please try again later!"
        }
        const title = titles[type]
        const description = descriptions[type]
        const color = type == "error"
            ? "RED"
            : "GREEN"

        const embed = new MessageEmbed()
            .setTitle(title)
            .setColor(color)
            .setDescription(description)

        if (type != "error") {
            embed.addField("Minimum level", `Level ${level}`)
            embed.addField("Role reward", role)
        }

        return embed
    },
    /**
     * 
     * @param {Message} message Message object
     * @param {Array} rewards Rewards array
     */
    allRewards(message, rewards = []) {
        const mappedRewards = rewards.map((reward, i) => {
            const role = displayRole(message, reward.roleID)
            return `#\`${i + 1}\`: **level**: ${reward.level}, **role**: ${role}`
        })

        const embed = new MessageEmbed()
            .setTitle("Rewards list")
            .setColor("RANDOM")
            .setDescription(rewards.length
                ? mappedRewards.join("\n")
                : "No rewards set up yet!"
            )

        return {
            embed,
            isEmpty: !!!rewards.length
        }
    },
    displayRole,
}
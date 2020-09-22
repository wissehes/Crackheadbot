const { Role, MessageEmbed } = require("discord.js")

module.exports = {
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
    }
}
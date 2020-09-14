const { MessageEmbed } = require("discord.js")
const Reward = require("../db/models/Reward")

const isPermitted = (message) => {
    if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == client.config.ownerID) {
        return true
    } else return false
}

const isPermittedToGiveRole = (message) => {
    return message.guild.me.hasPermission("MANAGE_ROLES")
}

exports.run = async (client, message, args, settings) => {
    if (!settings.levels) {
        return message.channel.send(`👁👄👁 this command requires levels to be turned on`)
    }
    if (!isPermitted(message)) {
        return message.channel.send("🔐 **You need the `Administrator` permission to use this command!**")
    }
    if (!isPermittedToGiveRole(message)) {
        return message.channel.send("🙄 I don't have the permission to manage roles...")
    }

    const option = await askOption(message)
    if (!option) return message.channel.send("no option was chosen")

    if (option === "add") {
        const role = await askRole(message)
        if (!role) return message.reply("no role was chosen")

        const level = await askLevel(message)
        if (level === false) return message.reply("no level was chosen")

        const newReward = new Reward({
            guildID: message.guild.id,
            roleID: role.id,
            level: level
        })
        newReward.save()
            .then(_ => {
                const embed = generateEmbed({
                    role,
                    level
                })
                message.channel.send(embed)
            })
            .catch(e => {
                console.error("An error occurred while saving a new reward:")
                console.log(e)
                const errEmbed = new MessageEmbed()
                    .setTitle("An error occurred!")
                    .setColor("RED")
                    .setDescription("An error occurred while trying to save your reward 🙄\n\n i'm sorry for this, pls try again in a few minutes x")
                message.channel.send(errEmbed)
            })
    } else if (option === "remove") {

    }
}

function askOption(message) {
    const filter = m => m.author.id === message.author.id && (m.content.toLowerCase() == "add" || m.content.toLowerCase() == "remove");
    return new Promise(async (resolve) => {
        await message.channel.send("What do you want to do? (add/remove)")

        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const option = collected.first().content.toLowerCase()
                resolve(option)
            })
            .catch(_ => resolve(false));
    })
}

function askRole(message) {
    const filter = m => m.author.id === message.author.id && m.mentions.roles.first()
    return new Promise(async (resolve) => {
        await message.channel.send("Which role should be rewarded?")

        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const role = collected.first().mentions.roles.first()
                resolve(role)
            })
            .catch(_ => resolve(false));
    })
}

function askLevel(message) {
    const filter = m => m.author.id === message.author.id && !isNaN(m.content)
    return new Promise(async (resolve) => {
        await message.channel.send("At which level do you receive this reward?")

        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const level = Number(collected.first().content)
                resolve(level)
            })
            .catch(_ => resolve(false));
    })
}

function generateEmbed({
    role,
    level
}) {
    const embed = new MessageEmbed()
        .setTitle("🎉 New reward created!")
        .setColor("GREEN")
        .setDescription("You just created a new reward with these settings:")
        .addField("Minimum level", `Level ${level}`)
        .addField("Role reward", role)
    return embed
}
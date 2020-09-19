const { MessageEmbed } = require("discord.js")
const Reward = require("../db/models/Reward")

const isPermitted = (message, ownerID) => {
    if (message.member.hasPermission("ADMINISTRATOR") || message.author.id == ownerID) {
        return true
    } else return false
}

const isPermittedToGiveRole = (message) => {
    return message.guild.me.hasPermission("MANAGE_ROLES")
}

const displayRole = (message, roleID) => {
    const role = message.guild.roles.resolve(roleID) || "**Not Found**"
    return role
}

exports.run = async (client, message, args, settings) => {
    if (!settings.levels) {
        return message.channel.send(`👁👄👁 this command requires levels to be turned on`)
    }
    if (!isPermittedToGiveRole(message)) {
        return message.channel.send("You do know i need to have the permission to manage roles right?")
    }
    if (!isPermitted(message, client.config.ownerID)) {
        const allRewards = await generateOverViewEmbed(message, true)
        return message.channel.send(allRewards)
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
                    role: displayRole(message, role.id),
                    level,
                    type: "created"
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
        const reward = await askReward(message, "Choose the reward to remove")

        reward.remove()
            .then(_ => {
                const embed = generateEmbed({
                    role: displayRole(message, reward.roleID),
                    level: reward.level,
                    type: "removed"
                })
                message.channel.send(embed)
            })
            .catch(e => {
                console.error("An error occurred while removing a reward:")
                console.log(e)
                const errEmbed = new MessageEmbed()
                    .setTitle("An error occurred!")
                    .setColor("RED")
                    .setDescription("An error occurred while trying to remove your reward 🙄\n\n i'm sorry for this, pls try again in a few minutes x")
                message.channel.send(errEmbed)
            })
    } else if (option === "view") {
        const allRewards = await generateOverViewEmbed(message)
        message.channel.send(allRewards)
    }
}

exports.info = {
    name: "rewards",
    aliases: [
        "autorole",
        "reward"
    ]
}

function askOption(message) {
    const filter = m => m.author.id === message.author.id &&
        (m.content.toLowerCase() == "add" ||
            m.content.toLowerCase() == "remove" ||
            m.content.toLowerCase() == "view");
    return new Promise(async (resolve) => {
        await message.channel.send("What do you want to do? (add/remove/view)")

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

function askReward(message, prompt) {
    return new Promise(async (resolve) => {
        const rewards = await Reward.find({
            guildID: message.guild.id
        })
        const mappedRewards = rewards.map((reward, i) => {
            const role = displayRole(message, reward.roleID)
            return `#\`${i + 1}\`: **level**: ${reward.level}, **role**: ${role}`
        })

        const embed = new MessageEmbed()
            .setTitle("Select reward")
            .setColor("RANDOM")
            .setDescription(`${prompt} \n\n${mappedRewards.join("\n")}`)
            .setFooter("Type the number of the reward you want to choose.")

        await message.channel.send(embed)

        const filter = m => m.author.id === message.author.id &&
            !isNaN(m.content) &&
            Number(m.content) <= rewards.length &&
            Number(m.content) > 0

        message.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ['time'] })
            .then(collected => {
                const rewardNumber = Number(collected.first().content) - 1
                const reward = rewards[rewardNumber]
                resolve(reward)
            })
            .catch(_ => resolve(false));
    })
}

async function generateOverViewEmbed(message, showPermRequired) {
    const rewards = await Reward.find({
        guildID: message.guild.id
    })
    if (!rewards[0]) {
        return "There are no rewards set up yet!"
    }
    const mappedRewards = rewards.map((reward, i) => {
        const role = displayRole(message, reward.roleID)
        return `#\`${i + 1}\`: **level**: ${reward.level}, **role**: ${role}`
    })
    const embed = new MessageEmbed()
        .setTitle("Rewards list")
        .setColor("RANDOM")
        .setDescription(mappedRewards.join("\n"))
    if (showPermRequired) {
        embed.setFooter("You need the Administrator permission to add/remove rewards!")
    }

    return embed;
}

function generateEmbed({
    role,
    level,
    type
}) {
    const title = type == "created" ? "🎉 New reward created!" : "🗑️ Reward removed!"
    const description = type == "created"
        ? "You just created a new reward with these settings:"
        : "You just removed the following reward!"

    const embed = new MessageEmbed()
        .setTitle(title)
        .setColor("GREEN")
        .setDescription(description)
        .addField("Minimum level", `Level ${level}`)
        .addField("Role reward", role)
    return embed
}
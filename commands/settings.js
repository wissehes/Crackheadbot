const { MessageEmbed } = require("discord.js")
const Guild = require("../db/models/Guild")
exports.run = async (client, message, args, settings) => {
    // Check if user is admin or bot owner. If not, deny access to this command. 
    const isPermitted = (member) => {
        if (message.member.hasPermission(MANAGE_GUILD) || message.author.id == client.config.ownerID) {
            return true
        } else return false
    }
    const settingsOverview = [
        {
            title: "👥 Welcome messages",
            usage: "{prefix}settings welcome",
            id: "welcome",
            description: "Toggles welcome messages.",
            current: settings.memberJoinedMessages,
            currentType: "boolean",
            save: async (value) => {
                settings.memberJoinedMessages = value
                await settings.save()
                return true;
            }
        }, {
            title: "👥 Welcome channel",
            usage: "{prefix}settings welcomechannel",
            id: "welcomechannel",
            description: "Sets the channel for welcome messages.",
            current: settings.memberJoinedChannel,
            currentType: "channel",
            save: async (value) => {
                settings.memberJoinedChannel = value
                await settings.save()
                return true;
            }
        }, {
            title: "🗨️ Welcome message",
            usage: "{prefix}settings welcomemessage",
            id: "welcomemessage",
            description: "Set custom welcome message.",
            current: settings.memberJoinedMessage,
            currentType: "joinMessage",
            save: async (value) => {
                settings.memberJoinedMessage = value
                await settings.save()
                return true;
            }
        }, {
            title: "👤 Leave messages",
            usage: "{prefix}settings leave",
            id: "leave",
            description: "Toggle leave messages.",
            current: settings.memberLeftMessages,
            currentType: "boolean",
            save: async (value) => {
                settings.memberLeftMessages = value
                await settings.save()
                return true;
            }
        }, {
            title: "👤 Leave channel",
            usage: "{prefix}settings leavechannel",
            id: "leavechannel",
            description: "Sets the channel for leave messages.",
            current: settings.memberLeftChannel,
            currentType: "channel",
            save: async (value) => {
                settings.memberLeftChannel = value
                await settings.save()
                return true;
            }
        }, {
            title: "🏆 Levels",
            usage: "{prefix}settings levels",
            id: "levels",
            description: "Toggles levels.",
            current: settings.levels,
            currentType: "channel",
            save: async (value) => {
                settings.levels = value
                await settings.save()
                return true;
            }
        }
    ]
    const settingsArray = [
        "welcome",
        "welcomechannel",
        "welcomemessage",
        "leave",
        "leavechannel",
        "levels"
    ]
    const overview = () => {
        const embed = new MessageEmbed()
            .setTitle("Crackheadbot settings")
            .setDescription(`Use the command \`${client.config.prefix}settings <option>\` to view more info about an option.`);
        settingsOverview.forEach(setting => {
            embed.addField(setting.title, `\`${setting.usage.replace("{prefix}", client.config.prefix)}\``, true)
        })
        return embed;
    }

    if (!args.length) {
        message.channel.send(overview());
    } else if (settingsArray.indexOf(args[0].toLowerCase()) !== -1) {
        if (!isPermitted(message.member)) {
            return message.channel.send("🔐 **You need the `Manage Server` permission to use this command!**")
        }
        const currentSetting = settingsOverview.find(s => s.id == args[0].toLowerCase())
        const validOptions = getValidOptions(currentSetting)

        if (args[1]) {
            if (validOptions.validate(message, args)) {
                await currentSetting.save(validOptions.saveAble(message, args))
                currentSetting.current = validOptions.saveAble(message, args)
                message.channel.send(getCurrentSettingEmbed(currentSetting, client))
            } else {
                message.channel.send(getCurrentSettingEmbed(currentSetting, client))
            }
        } else {
            message.channel.send(getCurrentSettingEmbed(currentSetting, client))
        }

    } else {
        message.channel.send(overview());
    }
}

function getCurrentValue(setting, client) {
    let value;
    switch (setting.currentType) {
        case "boolean":
            value = setting.current ? "`on`" : "`off`"
            break;
        case "channel":
            if (setting.current == "") {
                value = "`Not set`"
            } else {
                const channel = client.channels.resolve(setting.current)
                value = channel ? channel : "`Not found`"
            }
            break;
        case "joinMessage":
            if (setting.current == "") {
                value = "`<empty>`"
            } else {
                value = `\`${setting.current}\``
            }
            break;
    }
    return value;
}

function getValidOptions(setting) {
    let value;
    switch (setting.currentType) {
        case "boolean":
            value = {
                validate: (message, args) => {
                    if (args[1] == "on" || args[1] == "off") {
                        return true
                    } else return false
                },
                saveAble: (message, args) => {
                    if (args[1] == "on") {
                        return true
                    } else {
                        return false
                    }
                },
                readable: "on/off"
            }
            break;
        case "channel":
            value = {
                validate: (message) => {
                    if (message.mentions.channels.first()) {
                        return true
                    } else return false
                },
                saveAble: (message) => {
                    const channel = message.mentions.channels.first()
                    return channel.id
                },
                readable: "#channel",
            }
            break;
        case "joinMessage":
            value = {
                validate: (message, args) => {
                    return args.slice(1).join(" ").length > 0
                },
                saveAble: (message, args) => {
                    return args.slice(1).join(" ")
                },
                readable: "message"
            }
    }
    return value;
}

function getCurrentSettingEmbed(currentSetting, client) {
    const embed = new MessageEmbed()
        .setTitle(currentSetting.title)
        .setDescription(currentSetting.description)
        .addField("⚙️ Current value:", getCurrentValue(currentSetting, client))
        .addField("📝 Edit:", `\`${client.config.prefix}settings ${currentSetting.id} <${getValidOptions(currentSetting).readable}>\``)
    return embed
}
exports.info = {
    name: "settings",
}
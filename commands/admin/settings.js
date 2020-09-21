const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const {
    readableValue
} = require("../../util/settings")

module.exports = class SettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: ['config'],
            group: 'admin',
            memberName: 'settings',
            description: 'Change my settings 😼',
            userPermissions: ["MANAGE_GUILD"],
            guildOnly: true,
            guarded: true,
            args: [
                {
                    key: "setting",
                    prompt: "What setting would you like to change?",
                    type: "string",
                    default: "",
                    validate: s => {
                        if (this.allSettings.find(aa => aa.id == s)) {
                            return true
                        } else {
                            return "are u dumb- i asked for a setting to change/view"
                        }
                    }
                },
                {
                    key: "value",
                    prompt: "What would you like to change it to?",
                    type: "channel|string",
                    default: "",
                }
            ]
        });
    }
    async run(message, args) {
        const settings = await this.getSettings(message.guild)

        if (args.setting.length) {
            const foundSetting = this.allSettings.find(s => s.id == args.setting)
            if (foundSetting) {
                if (args.value) {
                    if (foundSetting.validate(args.value)) {
                        settings[foundSetting.key] = foundSetting.saveAble(args.value)
                        console.log(settings)
                        await message.guild.settings.set("settings", settings)
                    }
                }
                message.embed(this.settingEmbed(message, foundSetting, settings))
                return;
            }
        }
        message.embed(this.overviewEmbed(message.guild.commandPrefix))
    }

    overviewEmbed(prefix) {
        const embed = new MessageEmbed()
            .setTitle("Crackheadbot settings")
            .setColor("RANDOM")
            .setDescription(`Use the command \`${prefix}settings <option>\` to view more info about an option.`);
        this.allSettings.forEach(setting => {
            embed.addField(setting.title, `\`${prefix}settings ${setting.id}\``, true)
        })
        return embed;
    }

    settingEmbed(message, setting, currentSettings) {
        const settingValue = currentSettings[setting.key]

        const embed = new MessageEmbed()
            .setTitle(setting.title)
            .setDescription(setting.description)
            .addField("⚙️ Current value:", readableValue(message, setting.type.type, settingValue))
            .addField("📝 Edit:", `\`${message.guild.commandPrefix}settings ${setting.id} <${setting.type.example}>\``)
        return embed
    }

    allSettings = [
        {
            key: "joinMessages",
            id: "welcome",
            title: "👥 Welcome messages",
            description: "Toggle welcome messages.",
            type: {
                type: "onoff",
                example: "on/off"
            },
            validate(v) {
                if (v == "on" || v == "off") {
                    return true
                } else return false
            },
            saveAble(v) {
                if (v == "on") {
                    return true
                } else return false
            }
        },
        {
            key: "leaveMessages",
            id: "leave",
            title: "👤 Leave messages",
            description: "Toggle leave messages.",
            type: {
                type: "onoff",
                example: "on/off"
            },
            validate(v) {
                if (v == "on" || v == "off") {
                    return true
                } else return false
            },
            saveAble(v) {
                if (v == "on") {
                    return true
                } else return false
            }
        },
        {
            key: "joinChannel",
            id: "welcomechannel",
            title: "👥 Welcome channel",
            description: "Set the channel for welcome messages.",
            type: {
                type: "channel",
                example: "#channel"
            },
            validate(v) {
                if (typeof v == "object") {
                    return true
                } else return false
            },
            saveAble(v) {
                return v.id
            }
        },
        {
            key: "leaveChannel",
            id: "leavechannel",
            title: "👤 Leave channel",
            description: "Set the channel for leave messages.",
            type: {
                type: "channel",
                example: "#channel"
            },
            validate(v) {
                if (typeof v == "object") {
                    return true
                } else return false
            },
            saveAble(v) {
                return v.id
            }
        },
        {
            key: "levels",
            id: "levels",
            title: "🏆 Levels",
            description: "Turn levels on or off",
            type: {
                type: "onoff",
                example: "on/off"
            },
            validate(v) {
                if (v == "on" || v == "off") {
                    return true
                } else return false
            },
            saveAble(v) {
                if (v == "on") {
                    return true
                } else return false
            }
        },
    ]
}
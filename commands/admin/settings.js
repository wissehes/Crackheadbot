const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

const {
    getCurrentValue
} = require("../../util/settings")

const settingsArray = new Set([
    "welcome",
    "welcomechannel",
    "welcomemessage",
    "leave",
    "leavechannel",
    "levels"
])


module.exports = class SettingsCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'settings',
            aliases: [],
            group: 'admin',
            memberName: 'settings',
            description: 'Change my settings 😼',
            userPermissions: ["MANAGE_GUILD"],
            args: [
                {
                    key: "setting",
                    prompt: "What setting would you like to change?",
                    type: "string",
                    default: "",
                    validate: s => {
                        if (settingsArray.has(s)) {
                            return true
                        } else {
                            return "are u dumb- i asked for a setting to change"
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
        //const args = message.argString.split(" ")
        const settings = await this.getSettings(message.guild)
        const settingsOverview = this.generateSettingsOverview(settings)

        if (args.setting.length) {
            const currentSetting = settingsOverview.find(s => s.id == args.setting)

            if (args.value.length) {
                const theThings = getCurrentValue(currentSetting, this.client)
                if (theThings.validate(args.value)) {
                    const saveAble = theThings.saveAble(args.value)

                    await currentSetting.save(saveAble)

                    const embed = this.getCurrentValueEmbed(currentSetting, message.guild.commandPrefix)

                    message.embed(embed)
                } else {
                    const embed = this.getCurrentValueEmbed(currentSetting, message.guild.commandPrefix)

                    message.embed(embed)
                }
            } else {
                const embed = this.getCurrentValueEmbed(currentSetting, message.guild.commandPrefix)

                message.embed(embed)
            }
        } else {
            message.embed(this.overViewEmbed(message, settingsOverview))
        }
    }

    overViewEmbed(message, overview) {
        const embed = new MessageEmbed()
            .setTitle("Crackheadbot settings")
            .setDescription(`Use the command \`${message.guild.commandPrefix}settings <option>\` to view more info about an option.`);
        overview.forEach(setting => {
            embed.addField(setting.title, `\`${setting.usage.replace("{prefix}", message.guild.commandPrefix)}\``, true)
        })
        return embed;
    }

    getCurrentValueEmbed(currentSetting, prefix) {
        const embed = new MessageEmbed()
            .setTitle(currentSetting.title)
            .setDescription(currentSetting.description)
            .addField("⚙️ Current value:", getCurrentValue(currentSetting).value)
            .addField("📝 Edit:", `\`${prefix}settings ${currentSetting.id} <${currentSetting.valid}>\``)
        return embed
    }

    generateSettingsOverview(settings) {
        return [
            {
                title: "👥 Welcome messages",
                usage: "{prefix}settings welcome",
                id: "welcome",
                description: "Toggles welcome messages.",
                current: settings.memberJoinedMessages,
                currentType: "boolean",
                valid: "on/off",
                async save(value) {
                    settings.memberJoinedMessages = value
                    this.current = value
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
                valid: "#channel",
                async save(value) {
                    settings.memberJoinedChannel = value
                    this.current = value
                    await settings.save()
                    return true;
                }
            },
            {
                title: "👤 Leave messages",
                usage: "{prefix}settings leave",
                id: "leave",
                description: "Toggle leave messages.",
                current: settings.memberLeftMessages,
                currentType: "boolean",
                valid: "on/off",
                async save(value) {
                    settings.memberLeftMessages = value
                    this.current = value
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
                valid: "#channel",
                async save(value) {
                    settings.memberLeftChannel = value
                    this.current = value
                    await settings.save()
                    return true;
                }
            }, {
                title: "🏆 Levels",
                usage: "{prefix}settings levels",
                id: "levels",
                description: "Toggles levels.",
                current: settings.levels,
                currentType: "boolean",
                valid: "on/off",
                async save(value) {
                    settings.levels = value
                    this.current = value
                    await settings.save()
                    return true;
                }
            }
        ]
    }
}
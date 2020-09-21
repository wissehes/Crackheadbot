const { Command } = require("discord.js-commando");

const XP = require("../db/models/XP")
const Guild = require("../db/models/Guild")
const Reward = require("../db/models/Reward")

class BaseCommand extends Command {
    XP = XP
    Guild = Guild
    Reward = Reward

    getSettings = async (guild) => {
        let settings = guild.settings.get("settings")
        if (!settings) {
            await guild.settings.set("settings", {
                id: guild.id,
                joined: Date.now(),
                memberJoinedMessages: false,
                memberLeftMessages: false,
                memberJoinedChannel: "",
                memberLeftChannel: "",
                levels: false,
            })
            settings = guild.settings.get("settings")
        }
        return settings;
    }
}
module.exports = BaseCommand
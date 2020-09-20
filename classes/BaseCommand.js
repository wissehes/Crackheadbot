const { Command } = require("discord.js-commando");

const XP = require("../db/models/XP")
const Guild = require("../db/models/Guild")
const Reward = require("../db/models/Reward")

class BaseCommand extends Command {
    XP = XP
    Guild = Guild
    Reward = Reward
    getSettings = async (guild) => await this.Guild.findOne({ id: guild.id })
}
module.exports = BaseCommand
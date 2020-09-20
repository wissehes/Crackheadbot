const { Command } = require("discord.js-commando");

const XP = require("../db/models/XP")
const Guild = require("../db/models/Guild")
const Reward = require("../db/models/Reward")

class BaseCommand extends Command {
    XP = XP
    Guild = Guild
    Reward = Reward
}
module.exports = BaseCommand
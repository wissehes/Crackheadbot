const { Command } = require("discord.js-commando");

const XP = require("../db/models/XP");
const Guild = require("../db/models/Guild");
const Reward = require("../db/models/Reward");
const CrackheadMusicPerms = require("./music/CrackheadMusicPerms");

class BaseCommand extends Command {
  XP = XP;
  Guild = Guild;
  Reward = Reward;

  musicPerms = new CrackheadMusicPerms();

  getSettings = async (guild) => {
    let settings = guild.settings.get("settings");
    if (!settings) {
      await guild.settings.set("settings", {
        joined: Date.now(),
        joinMessages: false,
        leaveMessages: false,
        joinChannel: "",
        leaveChannel: "",
        levels: false,
      });
      settings = guild.settings.get("settings");
    }
    return settings;
  };
}
module.exports = BaseCommand;

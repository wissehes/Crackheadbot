const Command = require("../../classes/BaseCommand");

module.exports = class PauseCommand extends Command {
  constructor(client) {
    super(client, {
      name: "pause",
      aliases: [],
      group: "music",
      memberName: "pause",
      description: "pause the music",
      guildOnly: true,
    });
  }
  async run(message) {
    if (!this.musicPerms.canPause(message)) return;

    const player = this.client.shoukaku.getPlayer(message.guild.id);

    if (player.paused) {
      message.reply("the player is already paused 🧍");
    } else {
      await player.setPaused(true);
      message.reply("Paused player!");
    }
  }
};

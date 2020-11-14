const Command = require("../../classes/BaseCommand");

module.exports = class ResumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "resume",
      aliases: ["unpause"],
      group: "music",
      memberName: "resume",
      description: "Resume playback",
      guildOnly: true,
    });
  }
  async run(message) {
    if (!this.musicPerms.canPause(message)) return;

    const player = this.client.shoukaku.getPlayer(message.guild.id);

    if (player.paused) {
      await player.setPaused(false);
      message.reply("Resumed playback!");
    } else {
      message.reply("the player is not even paused-");
    }
  }
};

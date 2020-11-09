const Command = require("../../classes/BaseCommand");

module.exports = class SkipCommand extends Command {
  constructor(client) {
    super(client, {
      name: "skip",
      aliases: ["next", "jump"],
      group: "music",
      memberName: "skip",
      description: "Skips to the next song x",
      guildOnly: true,
    });
  }
  async run(message) {
    if (!this.musicPerms.canSkip(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    await dispatcher.player.stopTrack();

    message.react("⏭️");
  }
};

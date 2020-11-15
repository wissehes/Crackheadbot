const Command = require("../../classes/BaseCommand");

module.exports = class StopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "stop",
      aliases: ["dc", "disconnect", "sotp", "leave", "die"],
      group: "music",
      memberName: "stop",
      description: "Stop queue playback :skull:",
      guildOnly: true,
    });
  }
  async run(message) {
    if (!this.musicPerms.canStop(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);
    await dispatcher.destroy();

    message.react("👋");
  }
};

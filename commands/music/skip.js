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
      args: [
        {
          key: "songs",
          prompt: "How many sounds would you like to skip?",
          type: "integer",
          min: 1,
          default: 1,
        },
      ],
    });
  }
  async run(message, { songs }) {
    if (!this.musicPerms.canSkip(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    await dispatcher.skip(songs);

    message.react("⏭️");
  }
};

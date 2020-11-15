const Command = require("../../classes/BaseCommand");

module.exports = class RemoveCommand extends Command {
  constructor(client) {
    super(client, {
      name: "remove",
      aliases: ["del", "rm"],
      group: "music",
      memberName: "remove",
      description: "Remove a track from the queue",
      guildOnly: true,
      args: [
        {
          key: "number",
          prompt:
            "Which song do you want to remove from the queue? (the number of the song)",
          type: "integer",
          min: 1,
        },
      ],
    });
  }
  run(message, { number }) {
    if (!this.musicPerms.canSkip(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    const index = number - 1;
    const item = dispatcher.queue[index];
    if (item) {
      dispatcher.deleteTrack(index);

      message.say(`Removed \`${item.info.title}\` from the queue ✨`);
    } else {
      message.say("chile that item doesn't even exist");
    }
  }
};

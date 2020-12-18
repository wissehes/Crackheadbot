const Command = require("../../classes/BaseCommand");
const { arrayMove } = require("../../util/general");

module.exports = class MoveCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "move",
      aliases: ["mv"],
      group: "music",
      memberName: "move",
      description: "Move tracks in the queue",
      guildOnly: true,
      args: [
        {
          key: "oldPos",
          label: "old position",
          prompt: "What's the current position of the track?",
          type: "integer",
          min: 1,
          parse: (v) => v - 1,
        },
        {
          key: "newPos",
          label: "new position",
          prompt: "Where do you wanna move it to?",
          type: "integer",
          min: 1,
          parse: (v) => v - 1,
        },
      ],
    });
  }
  run(message, { oldPos, newPos }) {
    if (!this.musicPerms.canStop(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);
    const queue = dispatcher.getQueue();

    if (newPos > queue.length) {
      newPos = queue.length;
    }

    const trackTitle = queue[oldPos].info.title || "unknown title";
    const posNum = newPos + 1;

    message.say(
      `Moved \`${trackTitle}\` to position \`${posNum}\` in the queue 😌`
    );

    const newQueue = arrayMove(queue, oldPos, newPos);

    dispatcher.queue = newQueue;
  }
};

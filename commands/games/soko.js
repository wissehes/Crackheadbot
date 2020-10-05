const Command = require("../../classes/BaseCommand");
const { Soko } = require("../../util/Soko");

const reactions = [
  ["⬅️", "left"],
  ["⬆️", "up"],
  ["⬇️", "down"],
  ["➡️", "right"],
  ["🗑", "stop"],
];

module.exports = class SokoCommand extends Command {
  constructor(client) {
    super(client, {
      name: "soko",
      aliases: [],
      group: "games",
      memberName: "soko",
      description: "Play sokoban in Discord!",
    });
  }
  async run(message) {
    const soko = new Soko(7, 11);

    const grid = soko.getGrid();

    let msg = await message.say(grid);

    for (let i = 0; i < reactions.length; i++) {
      await msg.react(reactions[i][0]);
    }

    const filter = (reaction, user) =>
      user.id == message.author.id &&
      reactions.map((a) => a[0]).includes(reaction.emoji.name);

    const collector = msg.createReactionCollector(filter, {
      time: 60000,
    });

    collector.on("collect", async (reaction) => {
      const text = reactions.find((a) => a[0] == reaction.emoji.name)[1];

      if (text == "stop") {
        collector.stop();

        message.say("Stopped!");
      } else {
        const newGrid = soko.reGenerateGrid(text);

        // Remove user's reaction
        msg.reactions
          .resolve(reaction)
          .users.remove(message.author.id)
          .catch((e) => {});

        if (soko.won) {
          message.say("YOU WON!");
        }

        await msg.edit(newGrid);
      }
    });
  }
};

const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
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

    const gridEmbed = this.createGridEmbed(grid, message.author);

    let msg = await message.embed(gridEmbed);

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
        const stopEmbed = new MessageEmbed()
          .setTitle("Stopped")
          .setDescription("Stopped this game of Soko!");

        message.edit(stopEmbed);
      } else {
        const newGrid = soko.reGenerateGrid(text);

        const newGridEmbed = this.createGridEmbed(newGrid, message.author);

        // Remove user's reaction
        msg.reactions
          .resolve(reaction)
          .users.remove(message.author.id)
          .catch((e) => {});

        if (soko.won) {
          collector.stop();
          const wonEmbed = new MessageEmbed()
            .setTitle("You win!")
            .setDescription("Congratulations! You won this game of Soko!");
          return msg.edit(wonEmbed);
        }

        await msg.edit(newGridEmbed);
      }
    });
  }

  createGridEmbed(grid, user) {
    const embed = new MessageEmbed()
      .setTitle("Soko")
      .setAuthor(user.username, user.displayAvatarURL({ dynamic: true }))
      .setDescription(stripIndents`
      ${grid}

      **Use the reactions to move the player!**
      `);

    return embed;
  }
};

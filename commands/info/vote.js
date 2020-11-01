const Command = require("../../classes/BaseCommand");

module.exports = class VoteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "vote",
      aliases: [],
      group: "info",
      memberName: "vote",
      description: "Vote for me on top.gg 😗✌️",
    });
  }
  async run(message) {
    if (!this.client.dbl)
      return message.say("I'm not connected to top.gg (yet) 😔");

    const hasVoted = await this.client.dbl.hasVoted(message.author.id);

    if (hasVoted) {
      message.reply(
        "you have already voted in the past 12 hours, thank u so much 🥺"
      );
    } else {
      message.reply(
        "you can vote for me here: https://top.gg/bot/647169385252913173"
      );
    }
  }
};

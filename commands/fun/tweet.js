const Command = require("../../classes/BaseCommand");
const config = require("../../config");

module.exports = class TweetCommand extends Command {
  constructor(client) {
    super(client, {
      name: "tweet",
      aliases: [],
      group: "fun",
      memberName: "tweet",
      description: "Tweet stuff on our twitter! @CHEnergyTweets",
      guildOnly: true,
      throttling: {
        duration: 60,
        usages: 5,
      },
      args: [
        {
          key: "text",
          type: "string",
          prompt: "What do you want to tweet?",
        },
      ],
    });
  }

  run(message, { text }) {
    if (
      message.guild.id !== config.mainServerID &&
      !this.client.owners.some((o) => o.id == message.author.id)
    ) {
      return message.reply(
        "This command can only be used in Crackhead Energy!"
      );
    }
    this.client.twitter
      .tweet(`${text}\n\n-${message.author.tag}`)
      .then((data, err) => {
        message.reply(
          `Yay, it worked! https://twitter.com/CHEnergyTweets/status/${data.id_str}`
        );
      })
      .catch((e) => {
        message.reply(`I couldn't tweet it for some reason 🙄: ${e.message}`);
      });
  }
};

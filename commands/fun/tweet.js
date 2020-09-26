const Command = require("../../classes/BaseCommand");

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
    this.client.twitter
      .tweet(`${text}\n\n-${message.author.tag}`)
      .then((data) => {
        message.reply(
          `Yay, it worked! https://twitter.com/CHEnergyTweets/status/${data.id_str}`
        );
      })
      .catch(() => {
        message.reply("I couldn't tweet it for some reason 🙄");
      });
  }
};

const Command = require("../../classes/BaseCommand");
const translate = require("translate-google");
const { MessageEmbed } = require("discord.js");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "translate",
      aliases: [],
      group: "info",
      memberName: "translate",
      description: "Translate text 😌",
      details:
        "Translate text from various languages to English. It can currently only translate to English.",
      examples: ["translate Yo hablo Español", "translate <text>"],
      throttling: {
        duration: 15,
        usages: 2,
      },
      args: [
        {
          key: "text",
          type: "string",
          prompt: "What do you want to translate?",
          //default: "",
        },
      ],
    });
  }
  run(message, { text }) {
    if (text.length) {
      translate(text, { from: "auto", to: "en" })
        .then((translated) => {
          const embed = new MessageEmbed()
            .setDescription(translated)
            .setColor("RANDOM")
            .setFooter(`Translated from "${text}"`);
          message.embed(embed);
        })
        .catch(() =>
          message.say("I couldn't translate that for some reason...")
        );
    }
  }
};

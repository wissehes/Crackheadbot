const Command = require("../../classes/BaseCommand");
const translate = require("translate-google");
const { MessageEmbed } = require("discord.js");
const { Argument } = require("discord.js-commando");

module.exports = class TranslateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "translate",
      aliases: [],
      group: "info",
      memberName: "translate",
      description: "Translate text 😌",
      details:
        "Translate texts to a specific language. The default is English, to see the available languages user `crack listlang`.",
      examples: [
        "translate Yo hablo Español",
        "translate es I speak spanish",
        "translate {language} {text}",
      ],
      throttling: {
        duration: 15,
        usages: 2,
      },
      args: [
        {
          key: "text",
          type: "string",
          prompt: "What do you want to translate?",
        },
      ],
    });
  }

  languages = new Set(Object.keys(translate.languages));

  async run(message, { text }) {
    if (text.length) {
      let language = "en";

      const firstArg = text.split(" ")[0].toLowerCase();

      if (this.languages.has(firstArg)) {
        text = text.slice(firstArg.length + 1);
        language = firstArg;
      }

      if (!text.length) {
        const askTextArg = new Argument(this.client, {
          key: "text",
          type: "string",
          prompt: "What do you want to translate?",
        });

        const { value } = await askTextArg.obtain(message);
        text = value;
      }

      const formattedLanguage = translate.languages[language];

      translate(text, { from: "auto", to: language })
        .then((translated) => {
          const embed = new MessageEmbed()
            .setDescription(translated)
            .setColor("RANDOM")
            .setFooter(`Translated from "${text}" to ${formattedLanguage}`);
          message.embed(embed);
        })
        .catch((err) => {
          console.error(err);
          message.say("I couldn't translate that for some reason...");
        });
    }
  }
};

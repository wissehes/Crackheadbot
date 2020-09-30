const { MessageEmbed } = require("discord.js");
const { languages } = require("@k3rn31p4nic/google-translate-api");
const Command = require("../../classes/BaseCommand");

module.exports = class ListlanguagesCommand extends Command {
  constructor(client) {
    super(client, {
      name: "listlanguages",
      aliases: ["listlang"],
      group: "info",
      memberName: "listlanguages",
      description: "List all available languages for the translate command",
    });
  }
  run(message) {
    const filteredLanguages = Object.keys(languages).filter(
      (l) => typeof languages[l] != "function"
    );

    const mappedLanguages = filteredLanguages
      .map((l) => `\`${l}\`: ${languages[l]}`)
      .join(" - ");

    const embed = new MessageEmbed()
      .setTitle("Available languages")
      .setColor("BLUE")
      .setDescription(mappedLanguages)
      .setFooter(`Use translate {language} {text} to translate text`);

    message.embed(embed);
  }
};

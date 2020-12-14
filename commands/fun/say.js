const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class SayCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "say",
      aliases: [],
      group: "fun",
      memberName: "say",
      description: "Make me say something 😩",
      args: [
        {
          key: "msg",
          label: "message",
          prompt: "What would you like me to say?",
          type: "string",
        },
      ],
    });
  }
  run(message, { msg }) {
    const embed = new MessageEmbed()
      .setDescription(msg)
      .setColor("RANDOM")
      .setTimestamp();

    message.delete().catch(() => null);

    message.embed(embed);
  }
};

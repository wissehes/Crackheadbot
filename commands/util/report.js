const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

const reportTypes = [
  ["bug", "😳 Bug report", "RED"],
  ["feedback", "💌 Feedback", "GREEN"],
  ["suggestion", "👄 Suggestion", "YELLOW"],
];

module.exports = class ReportCommand extends Command {
  constructor(client) {
    super(client, {
      name: "report",
      aliases: ["suggest", "feedback", "bug"],
      group: "util",
      memberName: "report",
      description: "Report ",
      guarded: true,
      throttling: {
        duration: 60,
        usages: 1,
      },
      args: [
        {
          key: "type",
          prompt: `What do you want to report? (${reportTypes
            .map((a) => a[0])
            .join()})`,
          type: "string",
          oneOf: reportTypes.map((a) => a[0]),
          parse: (v) => reportTypes.find((t) => v == t[0]),
        },
        {
          key: "reportMessage",
          prompt: "What is the message of your report?",
          type: "string",
        },
      ],
    });
  }

  run(message, { type, reportMessage }) {
    // "Thank you for submitting" embed
    const thanksEmbed = new MessageEmbed()
      .setTitle(type[1])
      .setColor(type[2])
      .setDescription(`Thanks for submitting a ${type[0]} 😼`);

    // The embed that will be send to the owners
    const reportEmbed = new MessageEmbed()
      .setAuthor(
        message.author.tag,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setTitle(type[2])
      .setColor(type[2])
      .setDescription(reportMessage)
      .setTimestamp()
      .setFooter(`User ID: ${message.author.id}`);

    await this.DMOwners(reportEmbed)
        message.embed(thanksEmbed)
  }

  async DMOwners(embed) {
    for(const owner in this.client.owners) {
      try {
        await owner.send(embed)
      } catch(e) { void e }
    }
    return true;
  }
};

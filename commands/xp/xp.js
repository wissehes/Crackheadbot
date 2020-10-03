const Command = require("../../classes/BaseCommand");

const { MessageAttachment } = require("discord.js");

module.exports = class XPCommand extends Command {
  constructor(client) {
    super(client, {
      name: "xp",
      aliases: ["levels", "level", "rank"],
      group: "xp",
      memberName: "xp",
      description: "Shows your xp and rank.",
      guildOnly: true,
      args: [
        {
          key: "member",
          prompt: "Whose XP would you like to see?",
          type: "member",
          default: (msg) => msg.member,
        },
      ],
    });
  }

  async run(message, { member }) {
    if (!member) {
      return message.reply("they don't exist- 🥱");
    }

    let card;

    if (message.guild.me.hasPermission("ATTACH_FILES")) {
      message.channel.startTyping();

      const image = await this.client.xp.getXPCard(
        message.member,
        message.guild
      );

      card = new MessageAttachment(image, "rank.png");
    } else {
      card = await this.client.xp.getXPEmbed(message.member, message.guild);
    }
    message.channel.send(card);
    message.channel.stopTyping();
  }
};

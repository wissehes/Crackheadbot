const Command = require("../../classes/BaseCommand");

module.exports = class KickCommand extends Command {
  constructor(client) {
    super(client, {
      name: "kick",
      aliases: [],
      group: "moderation",
      memberName: "kick",
      description: "Kick users 😡",
      guildOnly: true,
      userPermissions: ["KICK_MEMBERS"],
      clientPermissions: ["KICK_MEMBERS"],
      args: [
        {
          key: "member",
          type: "member",
          prompt: "Who do you want to kick?",
        },
        {
          key: "reason",
          type: "string",
          prompt: "Why do you want to ban them?",
        },
      ],
    });
  }
  run(message, { member, reason }) {
    if (member.id == this.client.user.id) {
      return message.say("You cant kick me 😘");
    }
    if (member.id == message.author.id) {
      return message.say("chile- i'm sorry but you can't kick yourself");
    }
    if (!member.bannable) {
      return message.say("I can't kick them do they have a higher role? 🥱");
    }

    reason = reason.length ? reason : "No reason provided";

    member
      .kick(
        `Kicked by ${message.author.tag} (id: ${message.author.id}) for: ${reason}`
      )
      .then(() => {
        this.client.users
          .resolve(member.id)
          .send(
            `You have been kicked from \`${message.guild.name}\` for: \n${reason}`
          )
          .catch(() => void 0);

        message.say(`Kicked ${member.user.tag} for "${reason}"!`);
      })
      .catch(() => {
        message.say(
          "I couldn't kick them, please check if I have the correct permissions-"
        );
      });
  }
};

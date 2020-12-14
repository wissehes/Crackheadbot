const Command = require("../../classes/BaseCommand");

module.exports = class DMCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "dm",
      aliases: [],
      group: "admin",
      memberName: "dm",
      description: "DM someone",
      hidden: true,
      ownerOnly: true,
      args: [
        {
          key: "who",
          prompt: "Who do you wanna dm?",
          type: "user",
        },
        {
          key: "msg",
          label: "message",
          prompt: "What do you wanna dm them",
          type: "string",
        },
      ],
    });
  }
  run(message, { who, msg }) {
    who
      .send(msg)
      .then(() => message.say("📭 sent successfully!"))
      .catch(() => message.say("⚠️ couldn't send the message..."));
  }
};

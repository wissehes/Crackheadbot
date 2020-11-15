const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class LoopCommand extends Command {
  constructor(client) {
    super(client, {
      name: "loop",
      aliases: [],
      group: "music",
      memberName: "loop",
      description: "Loop the queue 😌",
      args: [
        {
          key: "action",
          prompt: "What would you like to do/loop?",
          oneOf: ["track", "queue", "off", "show"],
          type: "string",
          default: "show",
        },
      ],
    });
  }
  run(message, { action }) {
    if (!this.musicPerms.canLoop(message)) return;

    const dispatcher = this.client.queue.get(message.guild.id);

    if (action == "track") {
      dispatcher.loop = 1;
      message.say("Now looping single track");
    }

    if (action == "queue") {
      dispatcher.loop = 2;
      message.say("Now looping whole queue");
    }

    if (action == "off") {
      dispatcher.loop = 0;
      message.say("Turned looping off");
    }

    if (action == "show") {
      const options = {
        0: "Looping is turned off",
        1: "Looping single track",
        2: "Looping whole queue",
      };
      const currentOption = options[dispatcher.loop];

      const embed = new MessageEmbed()
        .setTitle(`Looping settings for ${message.guild.name}`)
        .setColor("RANDOM").setDescription(stripIndents`Current setting:
                \`${currentOption}\`
                `);

      message.embed(embed);
    }
  }
};

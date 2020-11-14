const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const CrackheadDispatcher = require("../../classes/music/CrackheadDispatcher");
const { formatMS } = require("../../util/music");

module.exports = class NowplayingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "nowplaying",
      aliases: ["np", "current"],
      group: "music",
      memberName: "nowplaying",
      description: "Shows the currently playing track",
      guildOnly: true,
    });
  }
  run(message) {
    if (!this.client.queue.has(message.guild.id)) {
      return message.reply("uh theres nothing playing-");
    }

    const dispatcher = this.client.queue.get(message.guild.id);
    const channel = dispatcher.voiceChannel();
    const player = dispatcher.getPlayer();
    const { current } = dispatcher;

    const title = current.info.title;
    const totallength = formatMS(current.info.length);
    const currentpos = formatMS(player.position);
    const bar = this.progressbar(dispatcher);
    const embed = new MessageEmbed()
      .setAuthor(`🔊 ${channel.name}`)
      .setColor("RANDOM").setDescription(stripIndents`**${title}**
      [${currentpos}] ${bar} [${totallength}]
      Added by ${current.requester.toString()}
      `);

    message.embed(embed);
  }

  /**
   * @param {CrackheadDispatcher} dispatcher
   */
  progressbar(dispatcher) {
    const amount = 20;
    const positionEmoji = "⚪";
    const empty = "▬";

    const totallength = dispatcher.current.info.length;
    const currentpos = dispatcher.getPlayer().position;

    const percentage = (currentpos / totallength) * 100;
    const rounded = this.roundToFive(percentage);

    const bar = [];

    for (let i = 1; i <= amount; i++) {
      if (this.roundToFive(i * 5) == rounded || (i == 1 && rounded == 0)) {
        bar.push(positionEmoji);
      } else bar.push(empty);
    }

    return bar.join("");
  }

  roundToFive = (num) => Math.round(num / 5) * 5;
};

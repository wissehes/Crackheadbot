const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const CrackheadTrack = require("../../classes/music/CrackheadTrack");
const { trim } = require("../../util/general");
const MusicUtils = require("../../util/music");

module.exports = class QueueCommand extends Command {
  constructor(client) {
    super(client, {
      name: "queue",
      aliases: ["q", "songs", "tracks"],
      group: "music",
      memberName: "queue",
      description: "Shows the currently playing queue!",
      guildOnly: true,
    });
  }
  run(message) {
    if (!this.client.queue.has(message.guild.id)) {
      return message.reply("uh theres nothing playing-");
    }

    const dispatcher = this.client.queue.get(message.guild.id);
    const queue = dispatcher.getQueue();

    const items = queue.map((t, i) => this.formatTrack(t, true, i));

    let footertext = "";

    if (items.length > 10) {
      items.splice(10, items.length);

      const howMany = queue.length - items.length;
      const noun = howMany > 1 ? "tracks" : "track";

      footertext = `\n*and ${howMany} more ${noun}...*`;
    }

    const embed = new MessageEmbed()
      .setTitle(`Now playing in ${message.guild.name}`)
      .setColor("RANDOM")
      .setDescription(
        stripIndents`**🎵 Now playing:**
        ${this.formatTrack(dispatcher.current)}

        **🎶 Playing next:**
        ${items.join("\n")}
        ${footertext}
        `
      );

    message.embed(embed);
  }

  /**
   * @param {CrackheadTrack} track
   */
  formatTrack(track, isQueue = false, i) {
    const prefix = isQueue ? `${i + 1}. ` : "";
    const title = track.info.title
      ? trim(track.info.title, 60)
      : "unknown title";
    const length = MusicUtils.formatMS(track.info.length);

    return `\`${prefix}${title}\` [${length}]`;
  }
};

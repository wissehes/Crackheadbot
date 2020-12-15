const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { ShoukakuTrackList } = require("shoukaku");
const Command = require("../../classes/BaseCommand");
const CrackheadTrack = require("../../classes/music/CrackheadTrack");
const { trim } = require("../../util/general");
const { formatMS } = require("../../util/music");

module.exports = class SearchCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "search",
      aliases: ["s"],
      group: "music",
      memberName: "search",
      description: "Search videos on YouTube",
      args: [
        {
          key: "query",
          prompt: "What do you wanna search for?",
          type: "string",
        },
      ],
    });
  }
  async run(message, { query }) {
    if (!this.musicPerms.canStartOrPlay(message)) return;

    message.channel.startTyping();

    const node = this.client.shoukaku.getNode();

    const results = await node.rest.resolve(query, "youtube");

    if (!results.tracks.length) {
      message.channel.stopTyping();
      message.reply("i couldn't find anything 😕");
      return;
    }

    const mappedResults = this.mapResults(results);

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`Search results for \`${trim(query, 20)}\``)
      .setAuthor(
        message.author.username,
        message.author.displayAvatarURL({ dynamic: true })
      )
      .setDescription(stripIndents`${mappedResults.join("\n")}`)
      .setFooter("send the number of the video");

    message.channel.stopTyping();
    message.embed(embed);

    const filter = (m) =>
      m.author.id == message.author.id &&
      (m.content.toLowerCase() == "cancel" || !isNaN(m.content));

    const answers = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 60000,
    });
    const answer = answers.first();

    if (!answers.size) {
      message.say("chooser timed out 😗✌️");
      return;
    }
    if (answer.content.toLowerCase() == "cancel") {
      message.say("chooser cancelled 😗✌️");
      return;
    }

    if (
      Number(answer.content) < 1 ||
      Number(answer.content) > mappedResults.length
    ) {
      message.say(
        `The number should be between 1 and ${mappedResults.length}!`
      );
      return;
    }

    const track = new CrackheadTrack({
      track: this.getTrackByNumber(results, Number(answer.content)),
      channel: message.channel,
      requester: message.author,
    });

    await this.client.queue.handle({
      message,
      node,
      track,
    });

    message.say(
      `Added \`${
        track.info.title || "unknown title"
      }\` to the queue :nail_care:`
    );
  }

  /**
   * Map the found tracks
   * @param {ShoukakuTrackList} results
   */
  mapResults(results) {
    const { tracks } = results;

    const mapped = tracks.map((t, i) => {
      const title = t.info.title ? trim(t.info.title, 50) : "unknown title";
      const length = formatMS(t.info.length);

      return `**${i + 1}**. \`${title}\` **[${length}]**`;
    });

    if (mapped.length > 10) mapped.splice(10, mapped.length);

    return mapped;
  }

  /**
   * Get the track by number
   * @param {ShoukakuTrackList} results
   * @param {number} number
   */
  getTrackByNumber(results, number) {
    const { tracks } = results;

    const track = tracks[number - 1];

    return track;
  }
};

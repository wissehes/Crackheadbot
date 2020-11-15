const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class RateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rate",
      aliases: [],
      examples: ["rate 5", "rate 3"],
      group: "music",
      memberName: "rate",
      description: "Rate the currently playing song from 0 to 5 stars 🌟",
      guildOnly: true,
      throttling: {
        duration: 20,
        usages: 2,
      },
      args: [
        {
          key: "rating",
          prompt: "Whats your rating for the song?",
          type: "integer",
          min: 0,
          max: 5,
        },
      ],
    });
  }
  async run(message, { rating }) {
    if (!this.musicPerms.isPlaying(message)) return;

    const { current } = this.client.queue.get(message.guild.id);

    const edited = await this.client.ratings.has(
      message.author,
      current.track.track
    );

    const newRating = await this.client.ratings.new({
      track: current.track.track,
      user: message.author,
      rating,
    });

    const stars = "⭐".repeat(rating);

    const preText = edited ? "Modified" : "Created new";
    const title = edited ? "🌟 Modified rating!" : "🌟 New rating!";

    const embed = new MessageEmbed()
      .setTitle(title)
      .setColor("GREEN")
      .setDescription(
        stripIndents`${preText} rating for \`${current.info.title}\` ✨
        **Rating:**
        ${stars || "*0/5 :pensive:*"}
        `
      );

    message.embed(embed);
  }
};

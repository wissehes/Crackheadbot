const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const GeneralUtils = require("../../util/general");

module.exports = class RatingCommand extends Command {
  constructor(client) {
    super(client, {
      name: "rating",
      aliases: ["ratings"],
      group: "music",
      memberName: "rating",
      description: "View ratings on the currently playing song",
      guildOnly: true,
      throttling: {
        duration: 20,
        usages: 2,
      },
      args: [
        {
          key: "track",
          prompt: "Which track's ratings do you want to see?",
          type: "string",
          isEmpty: (v, msg) => {
            if (msg.client.queue.has(msg.guild.id)) {
              return false;
            } else if (!v || !v.length) {
              return true;
            } else return false;
          },
        },
      ],
    });
  }
  async run(message, { track }) {
    let current, ratings;

    if (track) {
      const data = await this.findTrack(track);
      current = data.track || null;
      ratings = data.ratings || null;
    } else {
      const dispatcher = this.client.queue.get(message.guild.id);

      current = dispatcher.current;
      ratings = await this.client.ratings.get(current.track.track);
    }

    if (!ratings || !ratings.length) {
      if (current) {
        const prefix = message.guild.commandPrefix;
        return message.reply(
          `There are no ratings for this track yet, create one with \`${prefix}rate\``
        );
      } else {
        return message.reply("I couldn't find any tracks-");
      }
    }

    const ratingNumbers = ratings.map((r) => r.rating);
    const averageRating = GeneralUtils.averagenum(ratingNumbers);
    const avgStars = "⭐".repeat(Math.round(averageRating));

    const embed = new MessageEmbed()
      .setTitle("Ratings")
      .setColor("RANDOM")
      .setDescription(`**Ratings for \`${current.info.title}\`**`)
      .addField("Average rating", `${avgStars} (${averageRating}/5.00)`, true)
      .addField("Total ratings", ratings.length, true);

    message.embed(embed);
  }

  async findTrack(query) {
    const node = this.client.shoukaku.getNode();

    const results = await node.rest.resolve(query, "youtube");

    if (!results) {
      return {
        track: null,
        ratings: null,
      };
    }

    if (results.tracks.length > 10) {
      results.tracks.splice(10, results.tracks.length);
    }

    for (let i = 0; i < results.tracks.length; i++) {
      const track = results.tracks[i];

      const ratings = await this.client.ratings.get(track.track);

      if (ratings.length) {
        return {
          track: results.tracks[i],
          ratings,
        };
      }
    }
    return {
      track: results ? results.tracks[0] : null,
      ratings: null,
    };
  }
};

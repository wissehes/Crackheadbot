const { MessageEmbed, User } = require("discord.js");

class LyricsUtils {
  /**
   * @constructor
   * @param {CrackheadCommandoClient} client
   * @param {import("@ksoft/api").Track} song
   * @param {User} author
   */
  constructor(client, song, author) {
    this.client = client;
    this.song = song;
    this.author = author;

    this.maxLength = 2000;
  }

  embeds() {
    const embeds = [];

    const splitted = this.splitLyrics();

    for (let i = 0; i < splitted.length; i++) {
      const embed = this.createEmbed({
        text: splitted[i],
        first: i == 0,
        last: i == splitted.length - 1,
      });
      embeds.push(embed);
    }

    return embeds;
  }

  /**
   *
   * @param {object} opts
   * @param {String} opts.text text to display
   * @param {Boolean} opts.first is this the first embed?
   * @param {Boolean} opts.last is this the last embed?
   */
  createEmbed(opts) {
    const { text, first, last } = opts;

    const embed = new MessageEmbed().setColor("YELLOW").setDescription(text);

    if (first) {
      const title = this.song.name;
      const artist = this.song.artist.name;
      const artwork = this.song.artwork;

      embed.setTitle(`${artist} - ${title}`);
      embed.setThumbnail(artwork);
    }

    if (last) {
      const tag = this.author.tag;
      const avatar = this.author.displayAvatarURL({ dynamic: true });

      embed.setFooter(
        `Requested by ${tag} - Lyrics provided by KSoft.Si`,
        avatar
      );
    }

    return embed;
  }

  splitLyrics() {
    const splitted = this.song.lyrics.split(" ");
    const result = [];

    let string = "";

    for (let i = 0; i < splitted.length; i++) {
      const word = splitted[i];

      if (word.length + string.length + 1 < this.maxLength) {
        if (i == 0) {
          string += word;
        } else {
          string += " " + word;
        }
      } else {
        result.push(string);

        string = word;
      }
    }

    if (string.length) result.push(string);

    return result;
  }
}

module.exports = LyricsUtils;

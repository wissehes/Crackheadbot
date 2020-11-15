const Command = require("../../classes/BaseCommand");
const LyricsUtils = require("../../util/lyrics");

module.exports = class LyricsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "lyrics",
      aliases: [],
      examples: ["lyrics born this way lady gaga", "lyrics wap cardi b"],
      group: "music",
      memberName: "lyrics",
      description: "Shows the lyrics of a track!",
      throttling: {
        duration: 5,
        usages: 1,
      },
      args: [
        {
          key: "query",
          prompt: "Which lyrics do you want to search?",
          isEmpty: (v, msg) => {
            if (msg.client.queue.has(msg.guild.id)) {
              return false;
            } else if (v.length > 0) {
              return false;
            } else return true;
          },
          type: "string",
        },
      ],
    });
  }
  async run(message, { query }) {
    let realQuery = query;

    if (!query && this.client.queue.has(message.guild.id)) {
      realQuery = this.client.queue.get(message.guild.id).curent.info.title;
    }

    let songs;

    try {
      songs = await this.client.ksoft.lyrics.search(realQuery);
    } catch {
      songs = [];
    }

    if (!songs || !songs.length) {
      message.reply("i couldn't find any songs-");
      return;
    }

    const song = songs[0];
    const utils = new LyricsUtils(this.client, song, message.author);
    const embeds = utils.embeds();

    for (const embed of embeds) {
      await message.embed(embed);
    }
  }
};

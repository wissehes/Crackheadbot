const Command = require("../../classes/BaseCommand");
const {
  default: { get },
} = require("axios");
const { trim } = require("../../util/general");
const { MessageEmbed } = require("discord.js");
const moment = require("moment");

module.exports = class WikipediaCommand extends Command {
  constructor(client) {
    super(client, {
      name: "wikipedia",
      aliases: ["wiki"],
      group: "info",
      memberName: "wikipedia",
      description: "Search stuff on wikipedia 😀",
      throttling: {
        duration: 10,
        usages: 1,
      },
      args: [
        {
          key: "query",
          prompt: "What do you want to search?",
          type: "string",
        },
      ],
    });
  }
  async run(message, { query }) {
    const { data } = await get("https://en.wikipedia.org/w/api.php", {
      params: {
        action: "query",
        prop: "extracts|pageimages|info",
        format: "json",
        titles: query,
        exintro: "",
        explaintext: "",
        redirects: "",
        formatversion: 2,
      },
    });

    const page = data.query.pages[0];
    if (page.missing) {
      return message.reply(`I couldn't find anything 😔`);
    }

    const lastModified = new moment(page.touched).fromNow();

    const embed = new MessageEmbed()
      .setTitle(page.title)
      .setColor("RANDOM")
      .setAuthor(
        "Wikipedia",
        "https://i.imgur.com/aeGVj6A.png",
        "https://en.wikipedia.org/"
      )
      .setURL(`https://en.wikipedia.org/wiki/${encodeURIComponent(query)}`)
      .setDescription(trim(page.extract.replace(/(\n)/gi, "\n\n"), 2040))
      .setFooter(`Last modified ${lastModified}.`);

    message.embed(embed);
  }
};

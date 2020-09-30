const Command = require("../../classes/BaseCommand");
const memeApiURL = "https://meme-api.herokuapp.com/gimme";
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "meme",
      aliases: [],
      group: "fun",
      memberName: "meme",
      description: "Show a meme from reddit 🥴",
      throttling: {
        duration: 3,
        usages: 1,
      },
    });
  }
  async run(message) {
    const { data: meme } = await axios.get(memeApiURL);

    if (!meme) {
      return message.say("I couldnt get a meme ✋😔");
    }

    const { title, postLink, url, author, ups } = meme;

    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(postLink)
      .setColor("RANDOM")
      .setImage(url)
      .setFooter(`⬆️ ${ups} - by /u/${author}`);

    message.embed(embed);
  }
};

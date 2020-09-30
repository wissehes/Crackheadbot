const Command = require("../../classes/BaseCommand");
const memeApiURL = "https://meme-api.herokuapp.com/gimme";
const axios = require("axios");
const { MessageEmbed } = require("discord.js");

module.exports = class MemeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "meme",
      aliases: ["reddit"],
      group: "fun",
      memberName: "meme",
      description: "Show a meme from reddit 🥴",
      throttling: {
        duration: 3,
        usages: 1,
      },
      args: [
        {
          key: "subreddit",
          prompt: "Which subreddit?",
          type: "string",
          default: "",
          validate: (v) => {
            if (v.includes(" ")) {
              return "Subreddit can't contain spaces-";
            } else return true;
          },
          parse: (v) => {
            if (v.startsWith("/r/")) {
              return v.substr(3);
            } else if (v.startsWith("r/")) {
              return v.substr(2);
            }
            return v;
          },
        },
      ],
    });
  }
  async run(message, { subreddit }) {
    const api = subreddit.length ? `${memeApiURL}/${subreddit}` : memeApiURL;

    const { data: meme } = await axios.get(api);

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

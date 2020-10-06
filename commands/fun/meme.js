const Command = require("../../classes/BaseCommand");
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
    let reddit;
    try {
      reddit = subreddit.length
        ? await this.client.ksoft.images.reddit(subreddit, {
            removeNSFW: true,
            span: "week",
          })
        : await this.client.ksoft.images.meme();
    } catch (e) {}

    if (!reddit) {
      return message.say("I couldnt get a meme ✋😔");
    }

    //const { title, postLink, url, author, ups } = post;
    const { title, upvotes, link, author } = reddit.post;
    const embed = new MessageEmbed()
      .setTitle(title)
      .setURL(link)
      .setColor("RANDOM")
      .setImage(reddit.url)
      .setFooter(`⬆️ ${upvotes} - by ${author}`);

    message.embed(embed);
  }
};

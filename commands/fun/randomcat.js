const { MessageEmbed, MessageReaction, User } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const axios = require("axios");
const { CommandoMessage } = require("discord.js-commando");

module.exports = class RandomCatCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "randomcat",
      aliases: ["cat", "catpic", "purr", "pussy"],
      group: "fun",
      memberName: "randomcat",
      description: "Sends a random cat picture 🥺",
      throttling: {
        usages: 1,
        duration: 3,
      },
    });
  }
  /**
   * @param {CommandoMessage} message
   */
  async run(message) {
    const embed = await this.getCatEmbed();

    const msg = await message.embed(embed);

    await msg.react("😼");

    const filter = (reaction, user) =>
      reaction.emoji.name == "😼" && user.id == message.author.id;

    const collector = msg.createReactionCollector(filter, { time: 30000 });

    collector.on("collect", async (r) => {
      const newEmbed = await this.getCatEmbed();
      await msg.edit(newEmbed);

      msg.reactions
        .resolve(r)
        .users.remove(message.author.id)
        .catch(() => null);
    });
  }

  async getCatEmbed() {
    try {
      const { data } = await axios.get("http://aws.random.cat/meow");

      const url = data.file;

      const cuteCatEmbed = new MessageEmbed()
        .setTitle(this.getTitle())
        .setColor("RANDOM")
        .setImage(url);

      return cuteCatEmbed;
    } catch (_) {
      const errorEmbed = new MessageEmbed()
        .setTitle("Not this error occurring 🙄")
        .setDescription("I'm so sorry but I failed to deliver a cat picture 😔")
        .setColor("RED");

      return errorEmbed;
    }
  }

  getTitle() {
    const texts = [
      "Aww 🥺🥺",
      "They do be cute doe",
      "tf r they doing-",
      "oop <:dontsee:752483671923228695>",
      "💀",
      "😼",
      "😀😀😀",
      "chile anyways so-",
    ];
    return texts[Math.floor(Math.random() * texts.length)];
  }
};

const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class SpotifyCommand extends (
  Command
) {
  constructor(client) {
    super(client, {
      name: "spotify",
      aliases: [],
      group: "fun",
      memberName: "spotify",
      description:
        "Shows Spotify status of a user if they are listening to Spotify.",
      args: [
        {
          key: "user",
          prompt: "Whose Spotify status do you want to see?",
          type: "user",
          default: (msg) => msg.author,
        },
      ],
    });
  }
  async run(message, { user }) {
    const youOrThey = user.id == message.author.id ? "You" : "They";

    let presence = user.presence;

    if (presence) {
      presence = this.client.users.resolve(user.id).presence;
    }

    const spotify = presence.activities.find((a) => a.name == "Spotify");
    if (spotify) {
      const embed = new MessageEmbed()
        .setAuthor(spotify.details)
        .setColor("RANDOM")
        .setDescription(`by **${spotify.state}**`)
        .setThumbnail(spotify.assets.largeImageURL({ format: "png" }));
      const msg = await message.channel.send(embed);

      await msg.react("👍");
      await msg.react("👎");
    } else {
      message.reply(`${youOrThey}'re not listening to Spotify 👁👄👁`);
    }
  }
};

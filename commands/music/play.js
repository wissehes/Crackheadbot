const Command = require("../../classes/BaseCommand");
const CrackheadTrack = require("../../classes/music/CrackheadTrack");

module.exports = class playCommand extends Command {
  constructor(client) {
    super(client, {
      name: "play",
      aliases: ["p", "track"],
      group: "music",
      memberName: "play",
      description: "Play music 💀",
      guildOnly: true,
      clientPermissions: ["CONNECT", "SPEAK"],
      args: [
        {
          key: "query",
          label: "song",
          prompt: "What do you want to play?",
          type: "string",
        },
      ],
    });
  }
  async run(message, { query }) {
    if (!this.musicPerms.canStartOrPlay(message)) return;

    message.channel.startTyping();

    const node = this.client.shoukaku.getNode();

    let results;

    if (this.isURL(query)) {
      results = await node.rest.resolve(query);
    } else {
      results = await node.rest.resolve(query, "youtube");
    }

    if (!results) {
      message.channel.stopTyping();
      message.reply("I couldn't find anything...");
      return;
    }

    const firstTrack = new CrackheadTrack({
      track: results.tracks.shift(),
      requester: message.author,
      channel: message.channel,
    });

    await this.client.queue.handle({
      message,
      node,
      track: firstTrack,
    });

    message.channel.stopTyping();

    if (results.type == "PLAYLIST") {
      for (const track of results.tracks) {
        await this.client.queue.handle({
          message,
          node,
          track: new CrackheadTrack({
            track,
            requester: message.author,
            channel: message.channel,
          }),
        });
      }

      const PLName = results.playlistName || "unknown playlist name";
      const PLSize = results.tracks.length + 1;
      message.say(
        `Added playlist \`${PLName}\` (${PLSize} tracks) to the queue :sparkles:`
      );
    } else {
      message.say(
        `Added \`${
          track.info.title || "unknown title"
        }\` to the queue :nail_care:`
      );
    }
  }

  isURL(str) {
    try {
      new URL(str);
      return true;
    } catch {
      return false;
    }
  }
};

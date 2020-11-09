const { Collection, Message } = require("discord.js");
const CrackheadDispatcher = require("./CrackheadDispatcher");
const CrackheadTrack = require("./CrackheadTrack");

class CrackheadQueueHandler extends Collection {
  constructor(client) {
    super();
    this.client = client;
  }

  /**
   *
   * @param {object} trackData
   * @param {Message} trackData.message
   * @param {CrackheadTrack} trackData.track
   * @param {ShoukakuSocket} trackData.node
   */
  async handle(trackData) {
    const { message, track, node } = trackData;

    if (this.has(message.guild.id)) {
      this.get(message.guild.id).queue.push(track);
    } else {
      const player = await node.joinVoiceChannel({
        guildID: message.guild.id,
        voiceChannelID: message.member.voice.channelID,
      });

      const dispatcher = new CrackheadDispatcher({
        client: this.client,
        guild: message.guild,
        player,
      });

      dispatcher.queue.push(track);

      this.set(message.guild.id, dispatcher);

      return dispatcher;
    }
  }
}

module.exports = CrackheadQueueHandler;

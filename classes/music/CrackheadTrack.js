const { TextChannel, User } = require("discord.js");
const { ShoukakuTrack } = require("shoukaku");

class CrackheadTrack {
  /**
   *
   * @param {ShoukakuTrack} track
   * @param {TextChannel} channel
   * @param {User} requester
   */
  constructor(track, channel, requester) {
    this.track = track;
    this.info = track.info;
    this.requester = requester;
    this.textChannel = channel;
  }
}

module.exports = CrackheadTrack;

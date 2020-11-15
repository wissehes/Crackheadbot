const { TextChannel, User } = require("discord.js");
const { ShoukakuTrack } = require("shoukaku");

class CrackheadTrack {
  /**
   * @constructor
   * @param {object} opts
   * @param {ShoukakuTrack} opts.track
   * @param {TextChannel} opts.channel
   * @param {User} opts.requester
   */
  constructor(opts) {
    this.track = opts.track;
    this.info = opts.track.info;
    this.requester = opts.requester;
    this.textChannel = opts.channel;
  }
}

module.exports = CrackheadTrack;

const { Guild, TextChannel } = require("discord.js");
const { ShoukakuPlayer } = require("shoukaku");
const CrackheadCommandoClient = require("../CrackheadCommandoClient");

class CrackheadDispatcher {
  /**
   * @constructor
   * @param {object} options
   * @param {CrackheadCommandoClient} options.client
   * @param {Guild} options.guild
   * @param {ShoukakuPlayer} options.player
   */
  constructor(options) {
    this.client = options.client;
    this.guild = options.guild;
    this.player = options.player;

    this.queue = [];
    this.currentIndex = 0;

    this.firstTrack = true;

    /**
     * 0 = off
     * 1 = single track
     * 2 = whole queue
     */
    this.loop = 0;

    this._registerEvents();

    //this.utils = new
  }

  async play() {
    if (
      !this.client.queue.has(this.guild.id) ||
      (!this.queue.length && !this.loop)
    ) {
      return this.destroy("emptyQueue");
    }

    if (this.loop == 0) {
      this.current = this.queue.shift();
    } else if (this.loop == 2) {
      this.queue.push(this.current);
      this.current = this.queue.shift();
    }

    await this.player.playTrack(this.current.track);
  }

  /**
   * Skip a certain amount of tracks
   * @param {number} num
   */
  skip(num) {
    for (let i = 0; i < num - 1; i++) {
      if (this.loop == 0) {
        this.current = this.queue.shift();
      } else if (this.loop == 2) {
        this.queue.push(this.current);
        this.current = this.queue.shift();
      }
    }
    this.player.stopTrack();
  }

  voiceChannel() {
    return this.client.channels.resolve(
      this.player.voiceConnection.voiceChannelID
    );
  }

  getPlayer() {
    return this.client.shoukaku.getPlayer(this.guild.id);
  }

  getQueue() {
    // Send it this way so when splicing, it doesnt fuck up this.queue
    return [...this.queue];
  }

  destroy(reason) {
    this.player.disconnect();
    this.queue.length = 0;
    this.client.queue.delete(this.guild.id);
    this.player.removeAllListeners();

    if (reason == "emptyQueue") {
      this.current.textChannel.send("the queue is done yall").catch(() => null);
    } else if (reason == "error") {
      this.current.textChannel.send("some bitch ass error occurred 😭");
    }
  }

  _registerEvents() {
    this.player.on("start", () => {
      if (!this.firstTrack) {
        const vc = this.current.textChannel.guild.channels.cache.get(
          this.player.voiceConnection.voiceChannelID
        );

        this.current.textChannel
          .send(`Now playing \`${this.current.info.title}\` in \`#${vc.name}\``)
          .catch((e) => null);
      } else this.firstTrack = false;
    });

    this.player.on("end", () => {
      this.play().catch(() => {
        this.queue.length = 0;
        this.destroy("error");
      });
    });

    for (const playerEvent of ["closed", "error", "nodeDisconnect"]) {
      this.player.on(playerEvent, () => {
        this.queue.length = 0;
        try {
          this.destroy("error");
        } catch (e) {
          null;
        }
      });
    }
  }
}

module.exports = CrackheadDispatcher;

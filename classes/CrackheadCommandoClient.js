const {
  CommandoClient,
  CommandoClientOptions,
} = require("discord.js-commando");
const CrackheadRewards = require("./CrackheadRewards");
const CrackheadSnipes = require("./CrackheadSnipes");
const CrackheadTwitterClient = require("./CrackheadTwitterClient");
const CrackheadXP = require("./CrackheadXP");
const CrackheadAPI = require("../api");

const config = require("../config");

class CrackheadCommandoClient extends CommandoClient {
  constructor(options) {
    super(options || new CommandoClientOptions());

    this.rewards = new CrackheadRewards();
    this.xp = new CrackheadXP(this);
    this.snipes = new CrackheadSnipes(this);
    this.twitter = new CrackheadTwitterClient(this, config);
    this.apiServer = new CrackheadAPI(this);
  }

  setPresence() {
    this.user.setPresence({
      activity: {
        name: `you being a crackhead 👀 ✨ ${config.prefix}help ✨ ${this.guilds.cache.size} servers 😼`,
        type: "WATCHING",
      },
    });
  }
}

module.exports = CrackheadCommandoClient;

const {
  CommandoClient,
  CommandoClientOptions,
} = require("discord.js-commando");
const CrackheadRewards = require("./CrackheadRewards");
const CrackheadSnipes = require("./CrackheadSnipes");
const CrackheadTwitterClient = require("./CrackheadTwitterClient");
const CrackheadXP = require("./CrackheadXP");
const config = require("../config");

class CrackheadCommandoClient extends CommandoClient {
  constructor(options) {
    super(options || new CommandoClientOptions());

    this.rewards = new CrackheadRewards();
    this.xp = new CrackheadXP(this);
    this.snipes = new CrackheadSnipes(this);
    this.twitter = new CrackheadTwitterClient(this, config);
  }
}

module.exports = CrackheadCommandoClient;

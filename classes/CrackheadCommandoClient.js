const {
  CommandoClient,
  CommandoClientOptions,
} = require("discord.js-commando");
const CrackheadRewards = require("./CrackheadRewards");
const CrackheadSnipes = require("./CrackheadSnipes");
const CrackheadTwitterClient = require("./CrackheadTwitterClient");
const CrackheadXP = require("./CrackheadXP");
const CrackheadAPI = require("../api");

const { KSoftClient } = require("@ksoft/api");
const DBL = require("dblapi.js");

const config = require("../config");
const CrackheadShoukakuClient = require("./music/CrackheadShoukakuClient");
const CrackheadQueueHandler = require("./music/CrackheadQueueHandler");
const CrackheadRatings = require("./music/CrackheadRatings");

class CrackheadCommandoClient extends CommandoClient {
  constructor(options) {
    super(options || new CommandoClientOptions());

    this.rewards = new CrackheadRewards();
    this.xp = new CrackheadXP(this);
    this.snipes = new CrackheadSnipes(this);
    this.twitter = new CrackheadTwitterClient(this, config);
    this.apiServer = new CrackheadAPI(this);
    this.ksoft = new KSoftClient(config.api.ksoft);
    this.shoukaku = new CrackheadShoukakuClient(this, config.nodes);
    this.queue = new CrackheadQueueHandler(this);
    this.ratings = new CrackheadRatings(this);

    if (config.api.dbl) {
      this.dbl = new DBL(
        config.api.dbl,
        {
          statsInterval: 1800000,
        },
        this
      );
    }
  }

  setPresence() {
    this.user.setPresence({
      activity: {
        name: `you being a crackhead 👀 ✨ ${config.prefix}help ✨ ${this.guilds.cache.size} servers 😼`,
        type: "WATCHING",
      },
    });
  }

  get inviteURL() {
    return `https://discord.com/oauth2/authorize?client_id=${this.user.id}&scope=bot&permissions=305659006`;
  }
}

module.exports = CrackheadCommandoClient;

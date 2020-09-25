const { CommandoClient, CommandoClientOptions } = require("discord.js-commando");
const CrackheadRewards = require("./CrackheadRewards");
const CrackheadSnipes = require("./CrackheadSnipes");
const CrackheadXP = require("./CrackheadXP")

class CrackheadCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions())

        this.rewards = new CrackheadRewards()
        this.xp = new CrackheadXP(this)
        this.snipes = new CrackheadSnipes(this)
    }
}

module.exports = CrackheadCommandoClient
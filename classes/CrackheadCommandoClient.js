const { CommandoClient, CommandoClientOptions } = require("discord.js-commando");
const CrackheadRewards = require("./CrackheadRewards");

class CrackheadCommandoClient extends CommandoClient {
    constructor(options) {
        super(options || new CommandoClientOptions())

        this.rewards = new CrackheadRewards()
    }
}

module.exports = CrackheadCommandoClient
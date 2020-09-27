const Command = require("../../classes/BaseCommand");
const axios = require("axios");

module.exports = class IpCommand extends Command {
  constructor(client) {
    super(client, {
      name: "ip",
      aliases: [],
      group: "util",
      memberName: "ip",
      description: "Dm's the IP address the bot is running on. (owner only)",
      ownerOnly: true,
      guarded: true,
    });
  }
  async run(message) {
    const { ip } = (await axios.get("https://api.ipify.org/?format=json")).data;
    if (message.channel.type != "dm") message.reply("Sent you a dm!");

    message.author.send(`My IP is: \`${ip}\``);
  }
};

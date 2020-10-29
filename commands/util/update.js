const Command = require("../../classes/BaseCommand");
const shell = require("shelljs");
const { MessageEmbed } = require("discord.js");

module.exports = class UpdateCommand extends Command {
  constructor(client) {
    super(client, {
      name: "update",
      aliases: [],
      group: "commands",
      memberName: "update",
      description: "Update me <:horn_knee:763118031752396840>",
      ownerOnly: true,
    });
  }
  async run(message) {
    const filter = (m) => m.author.id == message.author.id;
    const LOCAL = shell.exec("git rev-parse HEAD");
    const REMOTE = shell.exec(`git rev-parse "origin"`);

    if (LOCAL == REMOTE) {
      await message.reply(
        `Local branch is already up-to-date. Do you wish to pull anyways?`
      );

      const msgs = await message.channel.awaitMessages(filter, {
        max: 1,
        time: 15000,
      });
      if (msgs.size) return;

      if (msgs.first().content.toLowerCase() == "no") {
        return;
      }
    }

    this.baseEmbed = new MessageEmbed()
      .setColor("RANDOM")
      .setDescription(
        `<a:loading:771466417798119496> Updating local branch...`
      );

    this.message = await message.embed(this.baseEmbed);

    shell.exec("git pull");

    await this.updateEmbed(`Updating/installing dependencies...`);
    shell.exec(`yarn`);

    await this.updateEmbed(`Done! Should I restart?`, false);
    const msgs = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 15000,
    });
    if (!msgs.size) return message.say(`okay then.`);

    if (msgs.first().content.toLowerCase() == "yes") {
      await this.updateEmbed("Restarting...");
      process.exit();
    } else message.say("Okay!");
  }

  async updateEmbed(text, loading = true) {
    if (loading) {
      this.baseEmbed.setDescription(`<a:loading:771466417798119496> ${text}`);
    } else this.baseEmbed.setDescription(text);

    return await this.message.edit(this.baseEmbed);
  }
};

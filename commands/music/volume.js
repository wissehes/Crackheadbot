const Command = require("../../classes/BaseCommand");

module.exports = class VolumeCommand extends Command {
  constructor(client) {
    super(client, {
      name: "volume",
      aliases: ["vol"],
      group: "music",
      memberName: "volume",
      description: "Change the volume of the player ✨",
      args: [
        {
          key: "volume",
          prompt: "What is the volume you'd like to set it to?",
          type: "integer",
          min: 0,
          max: 100,
        },
      ],
    });
  }
  async run(message, { volume }) {
    if (!this.musicPerms.canSkip(message)) return;

    if (this.client.dbl) {
      const hasVoted = await this.client.dbl.hasVoted(message.author.id);
      if (!hasVoted) {
        message.reply(
          `chile you need to vote for me before you can use this command- https://top.gg/bot/${this.client.user.id}`
        );
        return;
      }
    }

    const player = this.client.shoukaku.getPlayer(message.guild.id);
    player.setVolume(volume);

    message.reply(`Set player volume to ${volume}% :relieved:`);
  }
};

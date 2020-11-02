const { Guild } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class GuildinviteCommand extends Command {
  constructor(client) {
    super(client, {
      name: "guildinvite",
      aliases: ["gi"],
      group: "commands",
      memberName: "guildinvite",
      description: "Get an invite for a guild",
      ownerOnly: true,
      hidden: true,
      args: [
        {
          key: "guild",
          prompt: "What's the name/id of the guild?",
          type: "string",
          validate: (val, msg) => {
            const guild =
              msg.client.guilds.cache.get(val) ||
              msg.client.guilds.cache.find((g) =>
                g.name.toLowerCase().includes(val.toLowerCase())
              );

            return Boolean(guild);
          },
          parse: (val, msg) => {
            const guild =
              msg.client.guilds.cache.get(val) ||
              msg.client.guilds.cache.find(
                (g) => g.name.toLowerCase() == val.toLowerCase()
              );

            return msg.client.guilds.resolve(guild.id);
          },
        },
      ],
    });
  }
  async run(message, { guild }) {
    const msg = await message.say(
      "<a:loading:771466417798119496> Creating invite..."
    );

    this.createGuildInvite(guild)
      .then((invite) => msg.edit(invite.toString()))
      .catch((e) => msg.edit(`**⚠ An error occurred!** \n\`${e}\``));
  }

  /**
   *
   * @param {Guild} guild
   */
  async createGuildInvite(guild) {
    return new Promise(async (resolve, reject) => {
      const channels = guild.channels.cache.filter((c) => c.type == "text");

      const channel =
        guild.systemChannel ||
        channels.find((a) => a.name.includes("general")) ||
        channels.find((a) => a.name.includes("welcome")) ||
        channels.first();

      const invites = await channel.fetchInvites();

      if (invites.size) {
        resolve(invites.first());
      } else {
        channel
          .createInvite()
          .then((invite) => resolve(invite))
          .catch(() => reject("Couldn't create an invite!"));
      }
    });
  }
};

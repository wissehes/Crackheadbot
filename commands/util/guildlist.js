const { stripIndents } = require("common-tags");
const { MessageEmbed } = require("discord.js");
const { CommandoGuild } = require("discord.js-commando");
const Command = require("../../classes/BaseCommand");

module.exports = class GuildlistCommand extends Command {
  constructor(client) {
    super(client, {
      name: "guildlist",
      aliases: ["gl"],
      group: "commands",
      memberName: "guildlist",
      description: "Displays the list of guilds im in 😼",
      hidden: true,
      ownerOnly: true,
    });
  }
  run(message) {
    const guilds = this.client.guilds.cache.filter((guild) =>
      guild.me.hasPermission("CREATE_INSTANT_INVITE")
    );

    const mapped = this.mapGuilds(guilds);

    const embed = new MessageEmbed()
      .setTitle("My guilds 💀")
      .setAuthor(
        this.client.user.username,
        this.client.user.avatarURL(),
        this.client.inviteURL
      )
      .setColor("YELLOW")
      .setDescription(stripIndents`these are the guilds im in 😀👍
    \`\`\`
      ${mapped.join("\n")}
    \`\`\`
    `);
    message.embed(embed);
  }

  /**
   * @param {CommandoGuild[]} guilds
   */
  mapGuilds(guilds) {
    let maxLength = 2040;

    let mapped = guilds.map((a) => `» ${a.name} (${a.id})`);
    let text = mapped.join("\n");
    let length = text.length;

    while (length > maxLength) {
      mapped.pop();

      text = mapped.join("\n");
      length = text.length;
    }

    return mapped;
  }
};

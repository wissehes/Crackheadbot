const Command = require("../../classes/BaseCommand");

module.exports = class GencommandsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "gencommands",
      aliases: [],
      group: "util",
      memberName: "gencommands",
      description: "Generate commands list for the README, owner only 🥱",
      ownerOnly: true,
    });
  }
  run(message) {
    const commandsList = this.client.registry.groups.map((group) => {
      const commands = group.commands.filter((a) => !a.hidden);

      return `### ${group.name}\n\n${
        commands
          .map((command) => `* **${command.name}:** ${command.description}`)
          .join("\n") + "\n"
      }`;
    });

    const text = `Total commands: ${
      this.client.registry.commands.filter((a) => !a.hidden).size
    }.\n\n${commandsList.join("\n")}`;

    message.direct({
      files: [
        {
          attachment: Buffer.from(text),
          name: "commandlist.md",
        },
      ],
    });
    message.reply("Sent you a dm!");
  }
};

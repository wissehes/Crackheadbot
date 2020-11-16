const { Command } = require("discord.js-commando");

class APIUtils {
  /**
   * @param {Command} command
   */
  static formatCommand(command) {
    return {
      name: command.name,
      description: command.description,
      aliases: command.aliases || [],
      examples: command.examples || [],
      group: command.group.name,
      format: `${command.client.commandPrefix}${command.name}${
        command.format ? " " + command.format : ""
      }`,
      groupID: command.groupID,
      ownerOnly: command.ownerOnly || false,
    };
  }
}
module.exports = APIUtils;

const { Router } = require("express");

class CommandsRoute {
  constructor(client) {
    this.client = client;
    this.path = "/api/commands";
    this.router = Router();
  }
  init() {
    this.router.get("/", (req, res) => {
      const commands = this.client.registry.commands.map((command) => ({
        name: command.name,
        description: command.description,
        aliases: command.aliases || [],
        examples: command.examples || [],
        group: command.group.name,
        groupID: command.groupID,
        ownerOnly: command.ownerOnly || false,
      }));

      res.json(commands);
    });
  }
}

module.exports = CommandsRoute;

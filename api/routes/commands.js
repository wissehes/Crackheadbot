const { Router } = require("express");
const CrackheadCommandoClient = require("../../classes/CrackheadCommandoClient");
const APIUtils = require("../../util/apiutils");

class CommandsRoute {
  /**
   * @param {CrackheadCommandoClient} client
   */
  constructor(client) {
    this.client = client;
    this.path = "/api/commands";
    this.router = Router();
  }
  init() {
    this.router.get("/", (req, res) => {
      const commands = this.client.registry.commands.map((command) =>
        APIUtils.formatCommand(command)
      );

      res.json(commands);
    });

    this.router.get("/group/:group", (req, res) => {
      if (!this.client.registry.groups.has(req.params.group.toLowerCase())) {
        return res.status(404).json({
          error: "Command group not found",
        });
      }
      const group = this.client.registry.groups.get(
        req.params.group.toLowerCase()
      );

      const commands = group.commands.map(APIUtils.formatCommand);

      res.json(commands);
    });
  }
}

module.exports = CommandsRoute;

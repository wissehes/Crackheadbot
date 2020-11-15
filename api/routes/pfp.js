const { Router } = require("express");
const CrackheadCommandoClient = require("../../classes/CrackheadCommandoClient");

class CommandsRoute {
  /**
   * @param {CrackheadCommandoClient} client
   */
  constructor(client) {
    this.client = client;
    this.path = "/pfp";
    this.router = Router();
  }
  init() {
    this.router.get("/", (req, res) => {
      const pfpURL = this.client.user.avatarURL({ format: "png" });

      res.redirect(pfpURL);
    });
  }
}

module.exports = CommandsRoute;

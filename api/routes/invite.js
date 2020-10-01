const { Router } = require("express");

class CommandsRoute {
  constructor(client) {
    this.client = client;
    this.path = "/invite";
    this.router = Router();
  }
  init() {
    this.router.get("/", (req, res) => {
      const inviteURL = [
        `https://discord.com/oauth2/authorize`,
        `?client_id=${this.client.user.id}`,
        `&scope=bot&permissions=305659006`,
      ].join("");

      res.redirect(inviteURL);
    });
  }
}

module.exports = CommandsRoute;

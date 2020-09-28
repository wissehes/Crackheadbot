const express = require("express");
const CrackheadCommandoClient = require("../classes/CrackheadCommandoClient");
const fs = require("fs");

class CrackheadAPI {
  /**
   *
   * @param {CrackheadCommandoClient} client The commando client
   */
  constructor(client) {
    this.client = client;
    this.app = express();
    this.routes = [];
  }
  /**
   *
   * @param {Number} port The port you want to listen on
   */
  start(port) {
    this.routes = fs.readdirSync(`${__dirname}/routes`);
    this.routes.forEach((routePath) => {
      const route = require(`./routes/${routePath}`);
      const newRoute = new route(this.client);
      newRoute.init();

      this.app.use(newRoute.path, newRoute.router);
    });

    this.app.listen(port, () => console.log(`Listening on port ${port}`));
  }
}

module.exports = CrackheadAPI;

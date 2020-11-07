const { Shoukaku } = require("shoukaku");

class CrackheadShoukakuClient extends Shoukaku {
  constructor(client, nodes) {
    super(client, nodes);
    this.client = client;

    this._setupShoukakuEvents();
  }

  _setupShoukakuEvents() {
    this.on("ready", (name) => console.log(`Lavalink ${name}: Ready!`));

    this.on("error", (name, error) =>
      console.error(`Lavalink ${name}: Error Caught,`, error)
    );

    this.on("close", (name, code, reason) =>
      console.warn(
        `Lavalink ${name}: Closed, Code ${code}, Reason ${
          reason || "No reason"
        }`
      )
    );

    this.on("disconnected", (name, reason) =>
      console.warn(
        `Lavalink ${name}: Disconnected, Reason ${reason || "No reason"}`
      )
    );
  }
}

module.exports = CrackheadShoukakuClient;

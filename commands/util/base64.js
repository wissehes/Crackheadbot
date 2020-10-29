const Command = require("../../classes/BaseCommand");

module.exports = class Base64Command extends Command {
  constructor(client) {
    super(client, {
      name: "base64",
      aliases: ["64", "b64"],
      group: "util",
      memberName: "base64",
      description: "Encode and decode base64 🦧",
      args: [
        {
          key: "action",
          prompt: "Do you want to decode or encode base64?",
          type: "string",
          oneOf: ["encode", "decode"],
        },
        {
          key: "text",
          prompt: "What do you want to decode/encode?",
          type: "string",
        },
      ],
    });
  }
  run(message, { action, text }) {
    let parsed = "";

    if (action.toLowerCase() == "encode") {
      const encoded = Buffer.from(text);
      parsed = encoded.toString("base64");
    } else {
      const decoded = Buffer.from(text, "base64");
      parsed = decoded.toString();
    }
    const whatDidIDo = action == "encode" ? "encoded" : "decoded";
    message.say(`I ${whatDidIDo} it 😈:\n\`\`\`xl\n${parsed}\`\`\``);
  }
};

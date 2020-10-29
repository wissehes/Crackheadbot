const Command = require("../../classes/BaseCommand");
const { trim } = require("../../util/general");

module.exports = class BinaryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "binary",
      aliases: ["bin"],
      group: "util",
      memberName: "binary",
      description: "Encode and decode binary 👨‍💻",
      args: [
        {
          key: "action",
          prompt: "Do you want to decode or encode binary?",
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
      parsed = text
        .split("")
        .map((a) => this.ensureLength(a.charCodeAt().toString(2)) + " ")
        .join("");
    } else {
      parsed = text
        .split(" ")
        .map((a) => String.fromCharCode(parseInt(a, 2)))
        .join("");
    }

    const whatDidIDo = action == "encode" ? "encoded" : "decoded";
    message.say(
      `I ${whatDidIDo} it 😈:\n\`\`\`xl\n${trim(parsed, 1970)}\`\`\``
    );
  }

  ensureLength(number) {
    return "00000000".slice(String(number).length) + number;
  }
};

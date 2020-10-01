const Command = require("../../classes/BaseCommand");

module.exports = class ChanceCommand extends Command {
  constructor(client) {
    super(client, {
      name: "chance",
      aliases: ["bet"],
      group: "games",
      memberName: "chance",
      description: "Can you win a 1 in 1000 game? 😳",
      args: [
        {
          key: "chosenNumber",
          prompt: "What's your number? (1-1000)",
          type: "integer",
          max: 1000,
          min: 1,
        },
      ],
    });
  }
  run(message, { chosenNumber }) {
    const num = Math.floor(Math.random() * 1000);

    if (num == chosenNumber) {
      return message.say("Congrats!! You got it right!");
    } else
      return message.say(
        `Sorry! You lost... the right number was ${num}. Try again!`
      );
  }
};

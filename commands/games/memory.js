const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const { stripIndents } = require("common-tags");
const { capitalize, wait } = require("../../util/general");

const memWords = require("../../data/memoryWords.json");

const colors = [
  ["🔴", "red"],
  ["🟠", "orange"],
  ["🟡", "yellow"],
  ["🟢", "green"],
  ["🔵", "blue"],
  ["🟣", "purple"],
  ["⚫️", "black"],
];

module.exports = class MemoryCommand extends Command {
  constructor(client) {
    super(client, {
      name: "memory",
      aliases: [],
      group: "games",
      memberName: "memory",
      description: "Test your crack memory 💀",
    });
  }
  async run(message) {
    const howManyWords = Math.floor(Math.random() * 4) + 3;
    let words = [];
    for (let i = 0; i < howManyWords; i++) {
      words.push(memWords[Math.floor(Math.random() * memWords.length)]);
    }

    words = this.genWordsArray(words);

    const embed = new MessageEmbed().setTitle("Memory").setColor("RANDOM")
      .setDescription(stripIndents`
      Memorize the following:

        ${words.map((a) => a.text).join("\n")}
      `);

    const msg = await message.embed(embed);

    await wait(5000);

    msg.delete();

    const correctAnswer = this.getCorrectAnswer(words);

    message.say(`Which color was next to ${correctAnswer.word}?`);

    const filter = (m) => m.author.id == message.author.id;

    const collectedMsgs = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 5000,
    });

    if (!collectedMsgs.size) {
      message.say(
        `Time's up! It was ${correctAnswer.color.reverse().join(" ")}`
      );
    } else {
      const guess = collectedMsgs.first().content.toLowerCase();

      if (guess == correctAnswer.color[1]) {
        message.say("Congrats! you got it 😌");
      } else message.say("You failed... 😔");
    }
  }

  genWordsArray(arr) {
    const newArr = arr.map((a, i) => ({
      text: `${colors[i][0]} ${capitalize(a)}`,
      color: colors[i],
      word: a,
    }));
    return newArr;
  }

  getCorrectAnswer(words) {
    return words[Math.floor(Math.random() * words.length)];
  }
};

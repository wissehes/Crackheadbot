const axios = require("axios");
const { MessageEmbed, MessageFlags } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const { list, shuffleArray: shuffle } = require("../../util/general");

const difficulties = [
  ["easy", "Easy"],
  ["medium", "Medium"],
  ["hard", "Hard"],
];

const difficultyKeys = difficulties.map((d) => d[0]);

const options = ["A", "B", "C", "D"];

module.exports = class QuizCommand extends Command {
  constructor(client) {
    super(client, {
      name: "quiz",
      aliases: ["trivia"],
      group: "games",
      memberName: "quiz",
      description: "Play a quiz 😼",
      throttling: {
        duration: 15,
        usages: 1,
      },
      args: [
        {
          key: "difficulty",
          prompt: `Which difficulty do you want to play? (${list(
            difficultyKeys,
            "or"
          )})`,
          type: "string",
          oneOf: difficultyKeys,
          parse: (dif) => difficulties.find((d) => d[0] == dif.toLowerCase()),
        },
      ],
    });
  }
  async run(message, { difficulty }) {
    const { data } = await axios.get("https://opentdb.com/api.php", {
      params: {
        amount: 1,
        difficulty: difficulty[0],
        type: "multiple",
        encode: "url3986",
      },
    });

    const answers = data.results[0].incorrect_answers.map((a) =>
      decodeURIComponent(a)
    );
    const correctAnswer = decodeURIComponent(data.results[0].correct_answer);
    answers.push(correctAnswer);

    const question = decodeURIComponent(data.results[0].question);
    const category = decodeURIComponent(data.results[0].category);

    const questionEmbed = new MessageEmbed()
      .setTitle(question)
      .setColor("RANDOM")
      .setDescription(
        `*You have 15 seconds to answer*\n
${answers.map((an, i) => `**${options[i]}**) ${an}`).join("\n")}
      `
      )
      .addField("Category", category, true)
      .setFooter("Reply with the letter in front of the correct answer.");
    await message.embed(questionEmbed);
    const filter = (m) =>
      m.author.id == message.author.id &&
      options.includes(m.content.toUpperCase());

    const answeredMessages = await message.channel.awaitMessages(filter, {
      max: 1,
      time: 15000,
    });

    if (!answeredMessages.size) {
      return message.channel.send(
        `Times up yall... The answer was ${correctAnswer}`
      );
    }

    const userAnswer = this.getAnswerFromMessage(
      answers,
      answeredMessages.first()
    );

    const won = userAnswer === correctAnswer;

    if (won) {
      message.reply(this.getWonReply());
    } else message.reply(this.getWrongAnswerReply(correctAnswer));
  }

  getAnswerFromMessage(answers, message) {
    const mappedAnswers = answers.map((a, i) => ({
      letter: options[i],
      answer: a,
    }));
    return mappedAnswers.find((a) => a.letter == message.content.toUpperCase())
      .answer;
  }

  getWonReply() {
    const replies = [
      "PERIODT. you got it right 💅",
      "correct! :D",
      "damn girl you're smart- you got it right!",
      "you got it 😌",
      "you got the answer correct smartass",
    ];
    return replies[Math.floor(Math.random() * replies.length)];
  }
  getWrongAnswerReply(correct) {
    const replies = [
      "no dumbass it's {correct}",
      "yall- it's {correct}",
      "omg no- it's {correct} 🥱",
      "i- no?? it's {correct}",
      "girl- tf is ur iq? -100? the answer is {correct}",
    ];
    return replies[Math.floor(Math.random() * replies.length)].replace(
      "{correct}",
      correct
    );
  }
};

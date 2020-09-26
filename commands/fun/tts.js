const Command = require("../../classes/BaseCommand");

module.exports = class TtsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "tts",
      aliases: ["texttospeech"],
      group: "fun",
      memberName: "tts",
      description: "Sends a text-to-speech message 😼",
      throttling: {
        duration: 10,
        usages: 2,
      },
      args: [
        {
          key: "text",
          type: "string",
          prompt: "What do you want to convert to speech?",
        },
      ],
    });
  }
  run(message, { text }) {
    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en_au&client=tw-ob&q=${encodeURIComponent(
      text
    )}`;

    message.reply({
      files: [
        {
          attachment: ttsUrl,
          name: "tts.mp3",
        },
      ],
    });
  }
};

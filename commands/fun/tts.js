const Command = require("../../classes/BaseCommand");
const googleTTS = require("google-tts-api");
const { languages } = require("translate-google");
const { Argument } = require("discord.js-commando");

const availableVoices = [
  "ar-XA",
  "cmn-CN",
  "cs-CZ",
  "da-DK",
  "de-DE",
  "el-GR",
  "en-AU",
  "en-GB",
  "en-IN",
  "en-US",
  "fi-FI",
  "fil-PH",
  "fr-CA",
  "fr-FR",
  "hi-IN",
  "hu-HU",
  "id-ID",
  "it-IT",
  "ja-JP",
  "ko-KR",
  "nb-NO",
  "nl-NL",
  "pl-PL",
  "pt-BR",
  "pt-PT",
  "ru-RU",
  "sk-SK",
  "sv-SE",
  "tr-TR",
  "uk-UA",
  "vi-VN",
  "es-ES",
];

const languageCodes = Object.keys(languages);

const combined = new Set([...availableVoices, ...languageCodes]);

module.exports = class TtsCommand extends Command {
  constructor(client) {
    super(client, {
      name: "tts",
      aliases: ["texttospeech"],
      group: "fun",
      memberName: "tts",
      description: "Sends a text-to-speech message 😼",
      details:
        "Convert text to speech. To see all available languages use listlang",
      examples: ["tts es hola", "tts hello", "tts {language} {text}"],
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

  async run(message, { text }) {
    let language = "en";

    const firstArg = text.split(" ")[0].toLowerCase();

    if (combined.has(firstArg)) {
      text = text.slice(firstArg.length + 1);
      language = firstArg;
    }

    if (!text.length) {
      const askTextArg = new Argument(this.client, {
        key: "text",
        type: "string",
        prompt: "What do you want to convert to speech?",
      });

      const { value } = await askTextArg.obtain(message);
      text = value;
    }

    if (text.length > 200) {
      return message.reply("The text can't be longer than 200 characters-");
    }

    googleTTS(text, language)
      .then((url) => {
        message.reply({
          files: [
            {
              attachment: url,
              name: "tts.mp3",
            },
          ],
        });
      })
      .catch(function (err) {
        message.say("an error occurred 🙄");
      });
  }
};

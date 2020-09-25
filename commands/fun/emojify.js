const Command = require("../../classes/BaseCommand");
const emojis = require("../../data/emojis")

module.exports = class EmojifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'emojify',
            aliases: [],
            group: 'fun',
            memberName: 'emojify',
            description: 'emojify texts with the first letter of the name of the emoji 💀',
            args: [{
                key: "text",
                prompt: "What do you want to emojify?",
                type: "string"
            }]
        });
    }
    run(message, { text }) {

        const emojifiedText = text.split("").map(l => {
            if (l == " ") return "    ";

            const foundEmojisForLetter = emojis[l]

            if (foundEmojisForLetter) {
                return this.getRandomArrayValue(foundEmojisForLetter)
            } else {
                return l;
            }
        }).join(" ")

        message.say(emojifiedText)
    }

    getRandomArrayValue(arr) {
        return arr[Math.floor(Math.random() * arr.length)]

    }
}
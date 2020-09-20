const Command = require("../../classes/BaseCommand");

module.exports = class WeirdifyCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'weirdify',
            aliases: [],
            group: 'fun',
            memberName: 'weirdify',
            description: 'wEiRdIfY tExT lIkE tHiS',
            examples: ["weirdify text like this"],
            args: [
                {
                    key: "text",
                    type: "string",
                    prompt: "What do you want to weirdify?"
                }
            ]
        });
    }
    run(message, { text }) {
        const weirdifyFunc = this.oddOrEven()

        let currentPos = 0

        const picker = (letter) => {
            if (letter.trim() == " ") return letter;
            currentPos++
            return weirdifyFunc(currentPos, letter);
        }
        const allChars = text.split("")

        message.channel.send(allChars.map(picker).join(""))
    }
    oddOrEven() {
        let a = [
            this.weirdifyEvenNumbers,
            this.weirdifyOddNumbers
        ]
        return a[Math.floor(Math.random() * a.length)];
    }

    weirdifyOddNumbers(i, value) {
        if (i % 2 == 1)
            return value.toUpperCase();
        else
            return value;
    }
    weirdifyEvenNumbers(i, value) {
        if (i % 2 == 0)
            return value.toUpperCase();
        else
            return value;
    }
}
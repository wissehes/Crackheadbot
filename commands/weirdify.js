const evenNumbers = (value, i) => {
    if (i % 2 == 0)
        return value.toUpperCase();
    else
        return value;
}

const oddNumbers = (value, i) => {
    if (i % 2 == 1)
        return value.toUpperCase();
    else
        return value;
}

const pickers = [
    evenNumbers,
    oddNumbers
]

exports.run = async (client, message, args) => {
    if (!args[0]) {
        return message.reply("are u dumb")
    }
    const pickerFunc = pickers[Math.floor(Math.random() * pickers.length)];
    let currentPos = 0
    const picker = (letter) => {
        if (letter.trim() == "") return letter;
        currentPos++
        return pickerFunc(letter, currentPos);
    }
    const allChars = args.join(" ").split("")

    message.channel.send(allChars.map(picker).join(""))
}

exports.info = {
    name: "weirdify",
    aliases: []
}
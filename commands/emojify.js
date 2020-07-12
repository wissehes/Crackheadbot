const emojis = require("../data/emojis.js")

exports.run = async(client, message, args) => {
    if (args.length < 1) {
        return message.reply("what do i need to emojify idiot")
    }

    const messageFilter = m => m.author.id == message.author.id && (m.content.toLowerCase() == "yes" || m.content.toLowerCase() == "no")

    var emojifiedText = args.map(word => {
        return word.split("").map(letter => {
            if (letter == " ") return "   "
            const foundEmojis = emojis[letter]
                // Ignore any characters that arent emojified
            if (!foundEmojis || foundEmojis.length < 1) {
                return letter
            } else {
                return foundEmojis[Math.floor(Math.random() * foundEmojis.length)] + ' ';
            }
        }).join("")
    });

    await message.channel.send(emojifiedText.join("   "))
    const myMessage = await message.reply(`Do you want to tweet it? (yes/no)`)
    message.channel.awaitMessages(messageFilter, { max: 1, time: 15000, errors: ['time'] })
        .then(collected => {
            if (collected.first().content.toLowerCase() == "yes") {
                client.t.post("statuses/update", { status: `${emojifiedText.join("   ")}\n\n-${message.author.tag}` }, function(err, data, response) {
                    if (!err) {
                        message.reply(`Yay, it worked! https://twitter.com/CHEnergyTweets/status/${data.id_str}`)
                    } else {
                        message.reply("An error occured???")
                    }
                })
            } else {
                myMessage.delete()
                collected.first().delete().catch(e => void(e))
            }
        }).catch(e => {
            myMessage.delete()
        })
}
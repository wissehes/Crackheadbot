exports.run = async(client, message, args) => {
    if (args.length < 1) {
        message.reply("you need to give me something idiot")
    }

    const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&tl=en_au&client=tw-ob&q=${encodeURIComponent(args.join(" "))}`

    if (!message.member.voice.channel) {
        return message.reply({
            files: [{
                attachment: ttsUrl,
                name: "tts.mp3"
            }]
        })
    }

    if (client.dispatchers[message.guild.id]) {
        client.ttsQueue[message.guild.id].push(ttsUrl)
    } else {
        client.ttsQueue[message.guild.id] = [ttsUrl]
        message.member.voice.channel.join()
            .then(connection => {
                client.execQueue(message.guild, connection, true)
            })
            .catch(_ => {
                console.log(_)
                return message.reply("An error ocurred, maybe check my permissions?")
            })

    }

    // const connection = await message.member.voice.channel.join()
    //     .catch(_ => {
    //         return message.reply("I couldn't connect to your voice channel!")
    //     })

    // const dispatcher = connection.play(ttsUrl);

    // message.react("✅")

    // dispatcher.on("finish", () => {
    //     setTimeout(_ => connection.disconnect(), 1000)
    // })
}
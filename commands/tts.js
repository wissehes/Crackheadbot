exports.run = async(client, message, args) => {
    if (message.author.id != "354289971361742848") {
        return message.reply("GET OUT HOE")
    }
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

    const connection = await message.member.voice.channel.join()
        .catch(_ => {
            return message.reply("I couldn't connect to your voice channel!")
        })

    const dispatcher = connection.play(ttsUrl);

    message.react("✅")

    dispatcher.on("finish", () => connection.disconnect())
}
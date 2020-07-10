exports.run = (client, message, args) => {
    if (client.tweetCooldown.has(message.author.id)) {
        return message.reply("girl- wait a damn minute.")
    }

    const text = args.join(" ")

    if (text.length > 150) {
        return message.reply("it can't be longer than 150 characters idot")
    } else if (text.length < 10) {
        return message.reply("it can't be shorted than 10 characters idot")
    } else if (message.author.tag.length > 35) {
        return message.reply(`Sorry, your tag (${message.author.tag}) is too long! It can only be 35 characters`)
    }
    client.tweetCooldown.add(message.author.id)
    setTimeout(() => {
        client.tweetCooldown.delete(message.author.id)
    }, 60000)

    client.t.post("statuses/update", { status: `${text}\n\n-${message.author.tag}` }, function(err, data, response) {
        if (!err) {
            message.reply(`Yay, it worked! https://twitter.com/CHEnergyTweets/status/${data.id_str}`)
        } else {
            message.reply("An error occured???")
        }
    })
}
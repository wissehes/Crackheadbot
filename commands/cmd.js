exports.run = (client, message, args) => {
    if (message.author.id == "354289971361742848") {
        require('child_process').exec(args.join(" "), (e, sto, ste) => {
            if (e) {
                message.author.send(e.stack)
            }
            if (sto) {
                message.channel.send(`STDOut - ${sto}`);
            }
            if (ste) {
                message.channel.send(`STDErr - ${ste}`);
            }
        });
    } else {
        message.channel.send(`nope`)
    }

}
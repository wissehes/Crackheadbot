exports.run = (client, message, args) => {
    if (message.author.id == client.config.ownerID) {
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
exports.info = {
    name: "cmd",
    aliases: []
}
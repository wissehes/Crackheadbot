exports.run = (client, message, args) => {
    message.channel.send(`i don't care, ${message.author.username}`).catch(console.error);
}
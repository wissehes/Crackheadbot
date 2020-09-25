const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class AvatarCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'avatar',
            aliases: ['pfp', 'profilepic'],
            group: 'info',
            memberName: 'avatar',
            description: 'Show a users avatar',
            args: [{
                key: "user",
                type: "user",
                default: msg => msg.author,
                prompt: "Whose avatar do you want to see?"
            }]
        });
    }
    run(message, { user }) {
        const embed = new MessageEmbed()
            .setTitle(`${user.tag}'s avatar ✨`)
            .setColor("RANDOM")
            .setImage(user.displayAvatarURL({ dynamic: true, size: 2048 }))

        message.embed(embed)
    }
}
const Command = require("../../classes/BaseCommand");

module.exports = class BanCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'ban',
            aliases: [],
            group: 'moderation',
            memberName: 'ban',
            description: 'Ban members',
            examples: ["ban @user [reason]"],
            userPermissions: ["BAN_MEMBERS"],
            clientPermissions: ["BAN_MEMBERS"],
            guildOnly: true,
            args: [
                {
                    key: "user",
                    prompt: "Who do you want to ban?",
                    type: "member"
                }, {
                    key: "reason",
                    prompt: "Why do you want to ban them",
                    type: "string",
                }, {
                    key: "days",
                    prompt: "How many days of their messages do you want to delete? (0-7)",
                    type: "integer",
                    validate: n => {
                        if (n > -1 && n < 8) {
                            return true
                        } else return 'Number should be between 0 and 7!'
                    }
                }
            ]
        });
    }
    run(message, { user, reason, days }) {
        if (user.id == this.client.user.id) {
            return message.say("why do you want to ban me 😭")
        }
        if (user.id == message.author.id) {
            return message.say("oop- you want to ban yourself?")
        }
        if (!user.bannable) {
            return message.say("I can't ban them 🥱 do they have a higher role or something?")
        }

        message.guild.members.ban(user, {
            reason: `Banned by ${message.author.tag} (id: ${message.author.id}) for: ${reason}`,
            days
        })
            .then(() => {
                this.client.users.resolve(user.id).send(`You have been banned from \`${message.guild.name}\` for: \n${reason}`)
                    .catch(() => void (0))

                message.say(`Banned ${user.user.tag} for "${reason}"!`)
            })
            .catch(() => {
                message.say("I couldn't ban them, please check if I have the correct permissions")
            })
    }
}
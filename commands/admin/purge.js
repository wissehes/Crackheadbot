const Command = require("../../classes/BaseCommand");

module.exports = class PurgeCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'purge',
            aliases: ['clear', 'clean'],
            group: 'admin',
            memberName: 'purge',
            description: 'Remove multiple messages',
            clientPermissions: ["MANAGE_MESSAGES"],
            userPermissions: ["MANAGE_MESSAGES"],
            guarded: true,
            guildOnly: true,
            examples: [
                "purge 10 @user",
                "purge 10"
            ],
            args: [
                {
                    key: "howMany",
                    label: "amount of messages",
                    prompt: "How many messages do you want to purge?",
                    type: "integer",
                    validate: text => {
                        if (text <= 99 && text > 1) return true;
                        return 'You can only delete 1-99 messages at a time!';
                    },
                },
                {
                    key: "user",
                    prompt: "Which user do you want to purge?",
                    type: "user",
                    default: ""
                },
            ]
        });
    }
    run(message, args) {
        message.channel.messages.fetch({
            limit: 100
        }).then(messages => {
            if (args.user) {
                messages = messages.filter(m => m.author.id == args.user.id)
            }

            messages = messages.array().slice(0, args.howMany);
            message.channel.bulkDelete(messages)
            message.say(`Purged ${args.howMany} messages.`)
        })
    }
}
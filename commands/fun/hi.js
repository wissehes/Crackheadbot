const Command = require("../../classes/BaseCommand");

module.exports = class HiCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'hi',
            aliases: ['hello'],
            group: 'fun',
            memberName: 'hi',
            description: 'Says hi to you',
        });
    }
    run(message) {
        message.say("hi yall✨")
    }
}
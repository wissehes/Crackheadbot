const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");
const axios = require("axios")

module.exports = class RandomCatCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'randomcat',
            aliases: ['cat', 'catpic', 'purr'],
            group: 'fun',
            memberName: 'randomcat',
            description: 'Sends a random cat picture 🥺',
            throttling: {
                usages: 1,
                duration: 3
            }
        });
    }
    run(message) {
        axios.get("http://aws.random.cat/meow")
            .then(({ data }) => {
                const url = data.file

                const cuteCatEmbed = new MessageEmbed()
                    .setTitle(this.getTitle())
                    .setColor("RANDOM")
                    .setImage(url)

                message.embed(cuteCatEmbed)
            })
            .catch(() => {
                const errorEmbed = new MessageEmbed()
                    .setTitle("Not this error occurring 🙄")
                    .setDescription("I'm so sorry but I failed to deliver a cat picture 😔")
                    .setColor("RED")

                message.embed(errorEmbed)
            })
    }

    getTitle() {
        const texts = [
            "Aww 🥺🥺",
            "They do be cute doe",
            "tf r they doing-",
            "oop <:dontsee:752483671923228695>",
            "💀"
        ]
        return texts[Math.floor(Math.random() * texts.length)]
    }
}
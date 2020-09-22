const { get } = require("axios");
const { MessageEmbed } = require("discord.js");
const Command = require("../../classes/BaseCommand");

module.exports = class UrbanDictionaryCommand extends Command {
    constructor(client) {
        super(client, {
            name: 'urbandictionary',
            aliases: ['urban', 'define'],
            group: 'fun',
            memberName: 'urbandictionary',
            description: 'Search on Urban Dictionary!',
            throttling: {
                usages: 1,
                duration: 10
            },
            args: [{
                key: "term",
                prompt: "What do you want to search for?",
                type: "string"
            }]
        });
    }
    run(message, { term }) {
        get(`https://api.urbandictionary.com/v0/define?term=${encodeURIComponent(term)}`)
            .then(({ data }) => {
                if (data.list.length) {
                    const answer = data.list[0]
                    const embed = new MessageEmbed()
                        .setTitle(answer.word)
                        .setURL(answer.permalink)
                        .setAuthor(`By: ${answer.author}`)
                        .setColor("#efff00")
                        .addField("Definition", this.trimString(answer.definition, 1024))
                        .addField("Example", this.trimString(answer.example, 1024))
                        .addField("Rating", `${answer.thumbs_up} 👍 / ${answer.thumbs_down} 👎`)

                    message.embed(embed)
                } else {
                    const embed = new MessageEmbed()
                        .setTitle("No definition found!")
                        .setColor("RED")
                        .setDescription("I couldn't find a definition on Urban Dictionary 😔")

                    message.embed(embed)
                }
            })
    }

    trimString(string, maxlength) {
        if (string.length > maxlength) {
            return string.slice(0, maxlength - 3) + '...'
        } else return string
    }
}
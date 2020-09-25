/**
 * This is the CrackheadSnipes class.
 * This is used to add and get the snipes.
 */

const { Message } = require("discord.js")
const Snipe = require("../db/models/Snipe")

class CrackheadSnipes {
    constructor(client) {
        this.client = client
    }

    /**
     * 
     * @param {Message} message The message
     * @param {String} type the snipe type
     */
    async saveSnipe(message, type) {
        const snipe = new Snipe({
            userID: message.author.id,
            channelID: message.channel.id,
            message: message.content,
            type
        })

        if (await snipe.validate()) {
            await snipe.save()
        }
    }

    /**
     * 
     * @param {Guild} guild The guild object
     */
    async getSnipes(guild) {
        const allSnipes = await Snipe.find({
            guildID: guild.id
        })

        if (allSnipes.length) {
            return allSnipes
        } else return []
    }
}

module.exports = CrackheadSnipes;
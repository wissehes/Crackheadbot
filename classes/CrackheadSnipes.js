/**
 * This is the CrackheadSnipes class.
 * This is used to add and get the snipes.
 */

const { Message, TextChannel } = require("discord.js")
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

        try {
            await snipe.save()
        } catch (e) {
            console.error(e)
            void (0)
        }
    }

    /**
     * 
     * @param {TextChannel} channel The channel object
     */
    async getSnipes(channel) {
        const allSnipes = await Snipe.find({
            channelID: channel.id
        })

        return allSnipes
    }
}

module.exports = CrackheadSnipes;

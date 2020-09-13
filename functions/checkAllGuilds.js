/*
 * This script checks if all guilds are
 * in the database. If one is not, then
 * it adds the guild to the database. 
 */

const Guild = require("../db/models/Guild")
module.exports = (client) => {
    client.guilds.cache.array().forEach(async guild => {
        const checkGuild = await Guild.findOne({ id: guild.id })
        if (!checkGuild) {
            const newGuild = new Guild({
                id: guild.id
            })
            await newGuild.save()
        }
    })
}
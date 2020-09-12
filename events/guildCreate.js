const Guild = require("../db/models/Guild")

module.exports = (client, guild) => {
    new Guild({
        id: guild.id,
    }).save()
    console.log(`Joined new guild: ${guild.name}!`)
}
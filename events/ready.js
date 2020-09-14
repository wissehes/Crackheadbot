const checkAllGuilds = require("../functions/checkAllGuilds")

module.exports = (client) => {
    console.log(`Ready to serve in ${client.channels.cache.size} channels on ${client.guilds.cache.size} servers, for a total of ${client.users.cache.size} users.`);
    client.user.setPresence({
        activity: {
            name: `you being a crackhead 👀`,
            type: "WATCHING"
        }
    })
    console.log("Checking all guilds in database")
    checkAllGuilds(client)
}
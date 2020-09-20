// Import all things as usual
const config = require("./config")
const { CommandoClient } = require('discord.js-commando');
const path = require('path');
const connectDB = require("./db/")
const checkAllGuilds = require("./functions/checkAllGuilds")

// Setup commando client
const client = new CommandoClient({
    commandPrefix: config.prefix,
    owner: config.ownerID,
    invite: 'https://discord.gg/4s4QUbQ',
});

// Register command groups
client.registry
    .registerDefaultTypes()
    .registerGroups([
        ["xp", "XP commands"],
        ["fun", "Fun commands"],
        ["admin", "Admin commands"],
        ["owner", "Owner only commands"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands()
    .registerCommandsIn(path.join(__dirname, 'commands'))

connectDB(config.mongouri)

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setPresence({
        activity: {
            name: `you being a crackhead 👀`,
            type: "WATCHING"
        }
    })
    console.log("Checking all guilds in database")
    checkAllGuilds(client)
});

client.on('error', console.error);

client.login(config.token)
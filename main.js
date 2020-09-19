// Import all things as usual
const config = require("./config")
const { CommandoClient } = require('discord.js-commando');
const path = require('path');

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


client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setPresence({
        activity: {
            name: `you being a crackhead 👀`,
            type: "WATCHING"
        }
    })
});

client.on('error', console.error);
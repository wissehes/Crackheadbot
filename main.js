// Import all things as usual
const config = require("./config")
const { SQLiteProvider } = require('discord.js-commando');
const CrackheadCommandoClient = require("./classes/CrackheadCommandoClient");

const path = require('path');
const connectDB = require("./db/")
const checkAllGuilds = require("./functions/checkAllGuilds")

const sqlite = require('sqlite');
const sqlite3 = require("sqlite3");

// Setup commando client
const client = new CrackheadCommandoClient({
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
        ["info", "Info commands"],
        ["admin", "Admin commands"],
        ["moderation", "Moderation commands"],
        ["owner", "Owner only commands"]
    ])
    .registerDefaultGroups()
    .registerDefaultCommands({
        unknownCommand: false
    })
    .registerCommandsIn(path.join(__dirname, 'commands'))

connectDB(config.mongouri)

client.setProvider(
    sqlite.open({ filename: path.join(__dirname, 'settings.sqlite3'), driver: sqlite3.Database }).then(db => new SQLiteProvider(db))
).catch(console.error);

client.once('ready', () => {
    console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
    client.user.setPresence({
        activity: {
            name: `you being a crackhead 👀 | ${config.prefix}help`,
            type: "WATCHING"
        }
    })
    console.log("Checking all guilds in database")
    checkAllGuilds(client)
});

client.on('error', console.error);

client.on('commandError', (cmd, err) => {
    if (err instanceof FriendlyError)
        console.error(`Error in command ${cmd.groupID}: ${cmd.memberName} ${err}`);
});

client.login(config.token)
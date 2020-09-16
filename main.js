const Discord = require("discord.js");
const config = require("./config");

var Twit = require('twit');
const Enmap = require("enmap");

const client = new Discord.Client();
const fs = require("fs");
const connectDB = require("./db")
const Guild = require("./db/models/Guild")

const express = require("express")
const session = require("express-session")

const app = express()

client.config = config;

client.tweetCooldown = new Set()

client.dispatchers = {}
client.ttsQueue = {}

t = new Twit({
    consumer_key: config.twitterConsumer,
    consumer_secret: config.twitterConsumerSecret,
    access_token: config.twitterTokenKey,
    access_token_secret: config.twitterTokenSecret
});
//Bind 't' to 'client'
client.t = t;

// Connect to database
connectDB(config.mongouri)

// This loop reads the /events/ folder and attaches each event file to the appropriate event.
fs.readdir("./events/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        const event = require(`./events/${file}`);
        let eventName = file.split(".")[0];
        client.on(eventName, event.bind(null, client));
        delete require.cache[require.resolve(`./events/${file}`)];
    });
});

client.commands = new Enmap();

fs.readdir("./commands/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        // Load the command file itself
        let props = require(`./commands/${file}`);
        // Get just the command name from the file name
        let commandName = file.split(".")[0];
        console.log(`[COMMANDS] Attempting to load command ${commandName}`);
        // Here we simply store the whole thing in the command Enmap. We're not running it right now.
        client.commands.set(commandName, props);
        // Save the command alias(es) to the collection
        if (props.info && props.info.aliases && props.info.aliases.length) {
            props.info.aliases.forEach(aliasName => {
                client.commands.set(aliasName, props)
                console.log(`[ALIASES] Attempting to load alias ${aliasName}`);
            })
        }
    });
});

client.words = new Enmap();

fs.readdir("./words/", (err, files) => {
    if (err) return console.error(err);
    files.forEach(file => {
        if (!file.endsWith(".js")) return;
        // Load the command file itself
        let props = require(`./words/${file}`);
        // Get just the command name from the file name
        let wordName = file.split(".")[0];
        console.log(`[WORDS] Attempting to load word ${wordName}`);
        // Here we simply store the whole thing in the command Enmap. We're not running it right now.
        client.words.set(wordName, props);
    });
});

// Member add event
client.on("guildMemberAdd", async (member) => {
    const settings = await Guild.findOne({ id: member.guild.id })
    if (settings.memberJoinedMessages) {
        try {
            const channel = client.channels.resolve(settings.memberJoinedChannel)
            if (channel) {
                try {
                    const embed = new Discord.MessageEmbed()
                        .setTitle(`New member joined!`)
                        .setDescription(`${member} joined!`)
                        .setColor("RANDOM")
                        .setThumbnail(member.user.displayAvatarURL())
                        .addField(`Welcome!`, settings.memberJoinedMessage)
                    channel.send(embed)
                } catch (e) {
                    console.error(`Couldn't send welcome message to ${channel.name} in ${guild.name}`)
                }
            }
        } catch (e) {
            console.error(e)
        }
    }
})

client.login(config.token);

client.execQueue = (guild, connection, first = false) => {
    if (first) {
        client.dispatchers[guild.id] = connection.play(client.ttsQueue[guild.id][0])
        client.dispatchers[guild.id].once("finish", () => setTimeout(_ => client.execQueue(guild, connection, false), 1000))
    } else {
        client.ttsQueue[guild.id].shift()
        if (client.ttsQueue[guild.id][0]) {
            client.dispatchers[guild.id] = connection.play(client.ttsQueue[guild.id][0])
            client.dispatchers[guild.id].once("finish", () => client.execQueue(guild, connection, false))
        } else {
            connection.disconnect()
            delete client.ttsQueue[guild.id]
            delete client.dispatchers[guild.id]
        }
    }
}

app.use(session({
    secret: config.web.sessionSecret,
    resave: false,
    saveUninitialized: true,
    expires: 604800000,
    //cookie: { secure: true },
    name: 'CrackheadID'
}));

app.disable('x-powered-by')

// Read routes folder and connect it
client.on("ready", () => {
    fs.readdir("./web/routes/", (err, routes) => {
        if (err) return console.error(err);
        routes.forEach(r => {
            if (!r.endsWith(".js")) return;

            console.log(`[WEB] Attempting to load route ${r.split('.js')[0]}`)
            const route = require(`./web/routes/${r}`)(client)
            app.use(route.path, route.router)
        })
    })
})

app.listen(config.web.port, () => console.log(`[WEB] App started on port ${config.web.port}`))

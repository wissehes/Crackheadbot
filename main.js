const Discord = require("discord.js");
const config = require("./config.json");
//const Twitter = require('twitter');
var Twit = require('twit');
const Enmap = require("enmap");

const client = new Discord.Client();
const fs = require("fs");
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

client.login(config.token);

//Twitch Notifications via webhooks with IFTTT because twitch api = confusing
const http = require('http');
const express = require('express');
const app = express();
app.use(express.json());

app.get('/', function(req, res) {
    res.send('todo api works');
    client.channels.resolve(config.twitterChannelID).send(req.query.message)
});
app.post('/twitch', function(req, res) {
    //res.send('uwu');
    res.type('json')
    if (req.body.password != config.webhookPassword)
        return res.end(JSON.stringify({ error: 401, message: "not authorized" }));

    var ChannelName = req.body.ChannelName
    var ChannelUrl = req.body.ChannelUrl
    var CreatedAt = req.body.CreatedAt
    var StreamPreview = req.body.StreamPreview
    var Game = req.body.Game
    const embed = {
        "title": ChannelUrl,
        "url": ChannelUrl,
        "color": 6570404,
        "footer": {
            "text": CreatedAt
        },
        "image": {
            "url": StreamPreview
        },
        "author": {
            "name": ChannelName + " is now streaming"
        },
        "fields": [{
                "name": "Playing",
                "value": Game,
                "inline": true
            },
            {
                "name": "Started at (streamer timezone)",
                "value": CreatedAt,
                "inline": true
            }
        ]
    };
    client.channels.resolve('637042053259198478').send({ embed })
        .catch(console.log)
        /*.catch((error) => {return res.end(JSON.stringify(error))})*/
    res.end(JSON.stringify(embed))
});
const server = http.createServer(app);
const port = 1414;
server.listen(port);

client.execQueue = (guild, connection, first = false) => {
    console.log(client.ttsQueue[guild.id])
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
        }
    }
}
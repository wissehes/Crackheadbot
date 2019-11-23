const Discord = require("discord.js");
const config = require("./config.json");
//const Twitter = require('twitter');
var Twit = require('twit');
const Enmap = require("enmap");

const client = new Discord.Client();
const fs = require("fs");
client.config = config;

//Twitter API login
  /*t = new Twit({
    consumer_key: config.twitterConsumer,
    consumer_secret: config.twitterConsumerSecret,
    access_token_key: config.twitterTokenKey,
    access_token_secret: config.twitterTokenSecret
  });*/
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
    // If the file is not a JS file, ignore it (thanks, Apple)
    if (!file.endsWith(".js")) return;
    // Load the event file itself
    const event = require(`./events/${file}`);
    // Get just the event name from the file name
    let eventName = file.split(".")[0];
    // super-secret recipe to call events with all their proper arguments *after* the `client` var.
    // without going into too many details, this means each event will be called with the client argument,
    // followed by its "normal" arguments, like message, member, etc etc.
    // This line is awesome by the way. Just sayin'.
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
    console.log(`Attempting to load command ${commandName}`);
    // Here we simply store the whole thing in the command Enmap. We're not running it right now.
    client.commands.set(commandName, props);
  });
});
 
client.login(config.token);
// Twitter Notifications
var stream = t.stream('statuses/filter', { follow: config.twitterUsers });
stream.on('tweet', function(tweet) {
  //console.log(tweet)
  if(!config.twitterUsers.includes(tweet.user.id_str)) {return;}
  console.log(tweet.user.screen_name + ': ' +  tweet.text);
  //client.channels.get('647330755055452180').send(tweet.user.screen_name + ': ' +  tweet.text)
  client.channels.get(config.twitterChannelID).send(`**${tweet.user.name}** tweeted: https://twitter.com/${tweet.user.screen_name}/status/${tweet.id_str}`)
});
stream.on('error', function(error) {
  console.log(error)
});

//Twitch Notifications via webhooks with IFTTT because twitch api = confusing
const http = require('http');
const express = require('express');
const app = express();
app.use(express.json());
/*app.use('/', function(req, res) {
    res.send('todo api works');
});*/
app.get('/', function(req, res) {
  res.send('todo api works');
  client.channels.get(config.twitterChannelID).send(req.query.message)
});
app.post('/twitch', function(req, res) {
  //res.send('uwu');
  res.type('json')
  if(req.body.password != config.webhookPassword)
    return res.end(JSON.stringify({error: 401, message: "not authorized"}));


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
        "name": ChannelName+" is now streaming"
      },
      "fields": [
        {
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
  client.channels.get(config.twitterChannelID).send({embed})
  /*.catch((error) => {return res.end(JSON.stringify(error))})*/
  res.end(JSON.stringify(embed))
});
const server = http.createServer(app);
const port = 1414;
server.listen(port);
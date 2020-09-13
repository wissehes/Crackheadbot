# Crackheadbot

This is a fun little bot I at first created for a single server, but I am now working on making it public for everyone to add to their server.

# Features

[x] Welome and leave messages
[x] Custom welcome messages
[x] Fun little commands such as text-to-speech, weirdify and emojify
[x] TTS queue: when playing text-to-speech you can queue them.
[ ] Levels and auto role for levels (soon!)

# Installation

## Requirements

- Node.JS v12
  - This is the main runtime the Crackheadbot runs on
  - Install via [NVM](https://github.com/nvm-sh/nvm) or [nodejs.org](https://nodejs.org)
- MongoDB
  - This is the database Crackheadbot uses to save settings and levels
- A Discord bot token
  - This is used to authenticate with Discord
  - Learn more [here](https://discordjs.guide/preparations/setting-up-a-bot-application.html#creating-your-bot)
- Twitter tokens (twitter consumer, twitter consumer secret, etc.) (optional)
  - This is used for the `tweet` command

## Downloading repository and installing dependencies

Clone the repo like so:

```bash
git clone https://github.com/TheChicken14/Crackheadbot.git
```

then move to the directory and install the dependencies

```bash
cd Crackheadbot
npm install
```

## Configurating Crackheadbot

First, copy `config.example.js` to `config.js`

```bash
cp config.example.js config.js
```

then change them to their respective values.

# Running Crackheadbot

to start crackheadbot just run `node .`

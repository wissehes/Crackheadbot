const isMessageBad = require("../functions/isMessageBad")
const config = require("../config")
const Guild = require("../db/models/Guild")
const XP = require("../db/models/XP")
const { calculateLevel } = require("../db/functions")
module.exports = async (client, message) => {
    if (message.author.bot) {
        return;
    }

    if (message.channel.type == 'dm' || message.channel.type == 'group') {
        return message.channel.send({ files: ['./data/no.mp3'] })
    }

    // if (isMessageBad(message, config.badWordsRegex)) {
    //     message.reply("you can't say that word!")
    //         .then(m => m.delete({ timeout: 2000 }))
    //     message.delete().catch(e => console.log(e))
    //     return;
    // }
    const findUserObj = {
        userID: message.author.id,
        guildID: message.guild.id
    }
    const user = await XP.findOne(findUserObj)
    if (user) {
        user.xp++
        const currentLevel = calculateLevel(user.xp)
        if (currentLevel > user.level) {
            message.reply(`congratulations ${message.member}! You just leveled up to level **${currentLevel}**`)
        }
        await user.save()
    } else {
        findUserObj.xp = 1
        const newUser = new XP(findUserObj)
        await newUser.save()
    }

    const checkCommand = async (client, message) => {
        if (message.content.toLowerCase().indexOf(client.config.prefix) !== 0) return;

        const args = message.content.slice(client.config.prefix.length).trim().split(/ +/g);
        const command = args.shift().toLowerCase();

        const cmd = client.commands.get(command);

        if (!cmd) return;

        let settings;
        let settingsFailed = false
        try {
            settings = await Guild.findOne({ id: message.guild.id })
        } catch (e) {
            settingsFailed = true
            message.channel.send("An error occurred while pulling the database 🙄 i've notified the dev tho")
            client.users.resolve(config.ownerID).send(`bitch i couldnt pull the settings for the server ${message.guild.name} (id: ${message.guild.id}). pls fix`)
            try {
                client.users.resolve(config.ownerID).send(`This is the error:
                \`\`\`
                ${e}
                \`\`\``)
            } catch (_e) {
                console.log("couldn't send log:")
                console.log(e)
            }
        }
        // Only run if settings loaded successfully
        if (!settingsFailed)
            cmd.run(client, message, args, settings);
    }
    const checkWord = (client, message) => {
        const args = message.content.trim().split(/ +/g);
        // Grab the command data from the client.commands Enmap
        const cmd = client.words.get(message.content.toLowerCase());

        // If that command doesn't exist, silently exit and do nothing
        if (!cmd) return;

        // Run the command
        cmd.run(client, message, args);
    }
    checkCommand(client, message)

    // Make words only work in Crackhead Energy
    if (message.guild.id === "637042053259198468") {
        checkWord(client, message)
    }
};
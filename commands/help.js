const { MessageEmbed } = require("discord.js")

const commands = [
    {
        name: 'emojify',
        description: 'emojify texts with the first letter of the name of the emoji 💀'
    },
    {
        name: 'snipe',
        description: 'See the last deleted/edited messages 💀'
    },
    {
        name: 'hi',
        description: 'this says hi to u 😌'
    },
    {
        name: 'info',
        description: 'gives some info about me ✨'
    },
    {
        name: 'tts',
        description: 'if ur in vc its it joins and speaks otherwise it\'ll send it'
    }, {
        name: 'tweet',
        description: 'tweet stuff on [@CHEnergyTweets](https://twitter.com/CHEnergyTweets) on twitter'
    },
    {
        name: 'weirdify',
        description: 'wEiRdIfY tExT lIkE tHiS'
    },
    {
        name: 'xp',
        description: 'See yours or others\' xp'
    },
    {
        name: 'userinfo',
        description: 'Get info about a user🙋‍♂️'
    },
    {
        name: 'settings',
        description: '⚙️ Change my settings 😼'
    },
    {
        name: "rewards",
        description: "🎁 Set up level rewards"
    },
    {
        name: "leaderboard",
        description: "See the leaderboard of people with most xp"
    },
    {
        name: 'cmd',
        description: 'execute commands (only for owner)'
    },
    {
        name: 'eval',
        description: 'evaluate code (only for owner)'
    },
]
exports.run = async (client, message, args) => {
    const embed = new MessageEmbed()
        .setTitle("Crackhead help!")
        .setColor("RANDOM")
        .setDescription(`hi yall my prefix is crack and these are my commands:
    
${commands.map(c => `\`${c.name}\`: ${c.description}`).join("\n")}
    `)
    message.channel.send(embed)
}

exports.info = {
    name: "help",
    aliases: ['h']
}
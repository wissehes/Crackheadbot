const { MessageEmbed } = require("discord.js")

const commands = [
    {
        name: 'cmd',
        description: 'execute commands (only for owner)'
    },
    {
        name: 'emojify',
        description: 'emojify texts with the first letter of the name of the emoji 💀'
    },
    {
        name: 'eval',
        description: 'evaluate code (only for owner)'
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
        name: 'settings',
        description: '⚙️ Change my settings 😼'
    }
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
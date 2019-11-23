const Discord = require('discord.js');

exports.run = (client, message, args) => {

String.prototype.toHHMMSS = function () {
    var sec_num = parseInt(this, 10); // don't forget the second param
    var hours   = Math.floor(sec_num / 3600);
    var minutes = Math.floor((sec_num - (hours * 3600)) / 60);
    var seconds = sec_num - (hours * 3600) - (minutes * 60);

    if (hours   < 10) {hours   = "0"+hours;}
    if (minutes < 10) {minutes = "0"+minutes;}
    if (seconds < 10) {seconds = "0"+seconds;}
    var time    = hours+':'+minutes+':'+seconds;
    return time;
}
    function getOsUptime() {
        var seconds = os.uptime
        var days = Math.floor(seconds / (3600*24));
        seconds  -= days*3600*24;
        var hrs   = Math.floor(seconds / 3600);
        seconds  -= hrs*3600;
        var mnts = Math.floor(seconds / 60);
        seconds  -= mnts*60;
        return days+" days, "+hrs+" Hrs, "+mnts+" Minutes";
    }
    var os	= require('os');
    //ty https://stackoverflow.com/questions/15900485/correct-way-to-convert-size-in-bytes-to-kb-mb-gb-in-javascript
    function formatBytes(bytes, decimals = 2) {
        if (bytes === 0) return '0 Bytes';
    
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
    
        const i = Math.floor(Math.log(bytes) / Math.log(k));
    
        return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
    }
    var time = process.uptime();
    var DJSVer = require('../package.json').dependencies["discord.js"].slice('^'.length).trim().split(/ +/g);
    var embed = new Discord.RichEmbed()
    .setTitle("Skeppy Bot Info")
    .setDescription("Here's some info about me")
    .setURL('https://skeppybot.xyz')
    .setThumbnail(client.user.avatarURL)
    .addField(`Server count`, client.guilds.size, true)
    .addField(`System Uptime`, getOsUptime(), true)
    .addField(`Uptime`, (time + "").toHHMMSS(), true)
    .addField(`User count`, client.users.size, true)
    .addField(`Channels`, client.channels.size, true)
    .addField(`Node.JS version`, process.version, true)
    .addField(`Discord.JS version`, DJSVer, true)
    .addField(`Memory`, `${formatBytes(os.freemem())}/${formatBytes(os.totalmem())}`, true);
    message.channel.send(embed)
}   


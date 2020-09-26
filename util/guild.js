const { MessageEmbed } = require("discord.js");

class RemoveServerEmbed {
  constructor(guild) {
    this.guild = guild;
  }

  get embed() {
    const embed = new MessageEmbed()
      .setTitle(`🤡 I was removed from a server!`)
      .setColor("RED")
      .setDescription(`I was removed from ${this.guild.name}`)
      .addField(`Guild ID`, this.guild.id)
      .addField(`User count`, this.guild.userCount)
      .setThumbnail(this.guild.iconURL());

    return embed;
  }
}

class AddServerEmbed {
  constructor(guild) {
    this.guild = guild;
  }

  get embed() {
    const embed = new MessageEmbed()
      .setTitle(`🎉 I was added to a new server!`)
      .setColor("GREEN")
      .setDescription(`I was added to ${this.guild.name}`)
      .addField(`Guild ID`, this.guild.id)
      .addField(`User count`, this.guild.memberCount)
      .setThumbnail(this.guild.iconURL());

    return embed;
  }
}

module.exports = {
  RemoveServerEmbed,
  AddServerEmbed,
};

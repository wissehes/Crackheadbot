const { MessageEmbed } = require("discord.js");
const Moment = require("moment");

/**
 * Create leave card
 * @param {Object} member Member object
 */
function createCard(member) {
  const moment = new Moment(member.joinedAt);
  const joinedDate = moment.format("DD MMM, YYYY | h:mm a");
  const fromNow = moment.fromNow();

  const embed = new MessageEmbed()
    .setTitle(`Someone left!`)
    .setColor("RED")
    .setDescription(`${member.user.tag} left!`)
    .setThumbnail(member.user.displayAvatarURL())
    .addField(`Joined at`, `${joinedDate}, ${fromNow}`);

  return embed;
}
module.exports = {
  createCard,
};

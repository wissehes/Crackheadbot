/**
 * This script gets a member from a message
 * @param {Message} message 
 * @param {String} search 
 * @param {Boolean} bot 
 */
module.exports = (message, search = "", bot = false) => {
    const members = bot
        ? message.guild.members.cache
        : message.guild.members.cache.filter(u => !u.user.bot)
    let user =
        members.find(u => u.user.tag.toLowerCase().includes(search)) ||
        members.find(u => u.nickname ? u.nickname.toLowerCase().includes(search) : false) ||
        members.find(u => u.id == search)
    return user
        ? user
        : false
}
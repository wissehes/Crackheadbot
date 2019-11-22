module.exports = (guild, member) => {
    let role = member.guild.roles.get("637052863511527444");
    member.addRole(role)
    .catch(console.error);
}
// Import all things as usual
const config = require("./config");
const { SQLiteProvider, FriendlyError } = require("discord.js-commando");
const CrackheadCommandoClient = require("./classes/CrackheadCommandoClient");

const path = require("path");
const connectDB = require("./db/");
const checkAllGuilds = require("./functions/checkAllGuilds");

const sqlite = require("sqlite");
const sqlite3 = require("sqlite3");

// Welcome utils
const welcomeUtils = require("./util/welcome");

// Leave utils
const leaveUtils = require("./util/leave");

// Guild utils
const guildUtils = require("./util/guild");

// Setup commando client
const client = new CrackheadCommandoClient({
  commandPrefix: config.prefix,
  owner: config.ownerID,
  invite: "https://discord.gg/4s4QUbQ",
});

// Register command groups
client.registry
  .registerDefaultTypes()
  .registerGroups([
    ["xp", "XP commands"],
    ["fun", "Fun commands"],
    ["info", "Info commands"],
    ["admin", "Admin commands"],
    ["moderation", "Moderation commands"],
    ["owner", "Owner only commands"],
    ["util", "Utility commands"],
  ])
  .registerDefaultGroups()
  .registerDefaultCommands({
    unknownCommand: false,
  })
  .registerCommandsIn(path.join(__dirname, "commands"));

connectDB(config.mongouri);

client
  .setProvider(
    sqlite
      .open({
        filename: path.join(__dirname, "settings.sqlite3"),
        driver: sqlite3.Database,
      })
      .then((db) => new SQLiteProvider(db))
  )
  .catch(console.error);

// XP
client.on("message", (message) => {
  if (
    message.author.bot ||
    message.channel.type !== "text" ||
    !message.guild.available
  ) {
    return;
  }

  client.xp.giveUserXP(message.member, message.guild);
});

client.on("messageDelete", (message) => {
  client.snipes.saveSnipe(message, "delete");
});

client.on("messageUpdate", (oldMessage) => {
  client.snipes.saveSnipe(oldMessage, "edit");
});

client.on("guildRemove", (guild) => {
  client.setPresence();

  const foundChannel = client.channels.resolve(config.statsChannelID);

  if (foundChannel) {
    const removeServerEmbed = new guildUtils.RemoveServerEmbed(guild);
    foundChannel.send(removeServerEmbed.embed);
  }
});

client.on("guildCreate", (guild) => {
  client.setPresence();

  const foundChannel = client.channels.resolve(config.statsChannelID);

  if (foundChannel) {
    const addServerEmbed = new guildUtils.AddServerEmbed(guild);
    foundChannel.send(addServerEmbed.embed);
  }
});

client.on("guildMemberAdd", async (member) => {
  const settings = await member.guild.settings.get("settings");
  if (!settings) return;

  if (settings.joinMessages && settings.joinChannel.length) {
    const foundChannel = client.channels.resolve(settings.joinChannel);

    if (foundChannel) {
      try {
        if (member.guild.me.hasPermission("ATTACH_FILES")) {
          const welcomeCard = await welcomeUtils.createCard(member);
          foundChannel.send(welcomeCard);
        } else {
          const welcomeEmbed = welcomeUtils.createEmbed(member);
          foundChannel.send(welcomeEmbed);
        }
      } catch (e) {
        void e;
      }
    }
  }
});

client.on("guildMemberRemove", async (member) => {
  const settings = await member.guild.settings.get("settings");
  if (!settings) return;

  if (settings.leaveMessages && settings.leaveChannel.length) {
    const foundChannel = client.channels.resolve(settings.leaveChannel);
    if (foundChannel) {
      const leaveEmbed = leaveUtils.createCard(member);
      try {
        foundChannel.send(leaveEmbed);
      } catch (e) {
        void e;
      }
    }
  }
});

client.once("ready", () => {
  console.log(`Logged in as ${client.user.tag}! (${client.user.id})`);
  client.setPresence();

  client.apiServer.start(config.web.port);

  console.log("Checking all guilds in database");
  checkAllGuilds(client);
});

client.on("error", console.error);

client.on("commandError", (cmd, err) => {
  if (err instanceof FriendlyError)
    console.error(`Error in command ${cmd.groupID}: ${cmd.memberName} ${err}`);
});

client.login(config.token);

const { User, GuildMember, Guild, MessageEmbed } = require("discord.js");
const XP = require("../db/models/XP");
const Reward = require("../db/models/Reward");
const { Rank } = require("canvacord");

class CrackheadXP {
  constructor(client) {
    this.client = client;
  }

  /**
   *
   * @param {GuildMember} member The user you want to give the XP to
   * @param {Guild} guild The guild of the user
   * @param {Number} amount The amount of XP to give
   */
  giveUserXP(member, guild, amount = 1) {
    return new Promise(async (resolve, reject) => {
      try {
        let userXP = await XP.findOne({
          guildID: guild.id,
          userID: member.id,
        });
        if (userXP) {
          userXP.xp += amount;
        } else {
          userXP = new XP({
            guildID: guild.id,
            userID: member.id,
            xp: amount,
          });
        }

        await this.checkRewards(member, userXP);

        await userXP.save();
        resolve(true);
      } catch (e) {
        console.error("Error while creating/saving XP");
        console.error(e);
        reject(e);
      }
    });
  }

  /**
   *
   * @param {GuildMemer} member Member object
   * @param {Object} userXP XP Object
   */

  checkRewards(member, userXP) {
    const newLevel = this.calculateLevel(userXP.xp);

    return new Promise(async (resolve) => {
      const rewards = await Reward.find({
        guildID: member.guild.id,
      });
      if (rewards.length) {
        const rewardsToAssign = rewards.filter((r) => r.level <= newLevel);

        rewardsToAssign.forEach((reward) => {
          if (!member.roles.cache.find((r) => r.id == reward.roleID)) {
            member.roles.add(reward.roleID).catch();
          }
        });
      }
      resolve();
    });
  }

  /**
   *
   * @param {User|GuildMember} user The user you want to get the xp of
   * @param {Guild} guild The guild the user is in
   */
  async getUserXP(user, guild) {
    const foundXP = await XP.findOne({
      userID: user.id || user,
      guildID: guild.id,
    });

    if (!foundXP) {
      throw new Error("No user found!");
    }

    return foundXP;
  }

  /**
   *
   * @param {GuildMember} member Member object
   * @param {Guild} guild Guild object
   */

  async getXPCard(member, guild) {
    const userXP = await this.getUserXP(member, guild);

    const cardInfo = await this.getCardData(userXP, member);

    // const image = await canvacord.rank({
    //     username: member.user.username,
    //     discrim: member.user.discriminator,
    //     avatarURL: member.user.displayAvatarURL({ format: "png" }),
    //     color: "white",
    //     ...cardInfo
    // });
    const image = new Rank()
      .registerFonts()
      .setAvatar(member.user.displayAvatarURL({ format: "png" }))
      .setUsername(member.user.username)
      .setDiscriminator(member.user.discriminator)
      .setStatus(member.presence.status)
      .setCurrentXP(cardInfo.currentXP)
      .setRequiredXP(cardInfo.neededXP)
      .setLevel(cardInfo.level)
      .setRank(cardInfo.rank)
      .renderEmojis(true)
      .setProgressBar("#FFFFFF", "COLOR");

    return await image.build();
  }
  /**
   *
   * @param {GuildMember} member member object
   * @param {Guild} guild guild object
   */

  async getXPEmbed(member, guild) {
    const userXP = await this.getUserXP(member, guild);

    const { neededXP, rank, currentXP } = await this.getCardData(
      userXP,
      member
    );

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(`${member.nickname || member.user.username}'s XP`)
      .setThumbnail(member.user.displayAvatarURL()).setDescription(`
**Rank**: #${rank}
**XP**: ${currentXP}
**Level**: ${userXP.level}
**XP Required to level up**: ${neededXP}
`);
    return embed;
  }

  /**
   *
   * @param {Object} userXP UserXP object
   * @param {GuildMember} member member object
   */

  async getCardData(userXP, member) {
    const currentXP = userXP.xp - this.calculateXPForLevel(userXP.level);
    const neededXP = this.calculateRequiredXP(userXP.xp) + currentXP;
    const rank = await XP.getRank(userXP, member.guild);

    return {
      rank: rank,
      level: userXP.level,
      neededXP: neededXP,
      currentXP: currentXP,
    };
  }

  /**
   *
   * @param {Number} xp
   */

  calculateLevel(xp) {
    return Math.floor(0.1 * Math.sqrt(xp));
  }

  /**
   * Calculates required XP to level up
   * @param {Number} xp Current XP of user
   */
  calculateRequiredXP(xp) {
    let currentLevel = this.calculateLevel(xp);

    const nextLevel = this.calculateLevel(xp) + 1;

    let neededXP = 0;
    while (currentLevel < nextLevel) {
      neededXP++;
      currentLevel = this.calculateLevel(xp + neededXP);
    }
    return neededXP;
  }

  /**
   * Calculates the amount of xp that a level requires.
   * @param {Number} level The current level
   */
  calculateXPForLevel(level) {
    let xp = 0;
    let currentLevel = 0;

    while (currentLevel != level) {
      xp++;
      currentLevel = this.calculateLevel(xp);
    }
    return xp;
  }
}

module.exports = CrackheadXP;

const { User, GuildMember, Guild } = require("discord.js")
const XP = require("../db/models/XP")
const Reward = require("../db/models/Reward")

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
                })
                if (userXP) {
                    userXP.xp += amount
                } else {
                    userXP = new XP({
                        guildID: guild.id,
                        userID: member.id,
                        xp: amount
                    })
                }

                await this.checkRewards(member, userXP)

                await userXP.save()
                resolve(true)
            } catch (e) {
                console.error("Error while creating/saving XP")
                console.error(e)
                reject(e)
            }
        })
    }

    checkRewards(member, userXP) {
        const newLevel = this.calculateLevel(userXP.xp)

        return new Promise(async (resolve) => {
            const rewards = await Reward.find({
                guildID: member.guild.id
            })
            if (rewards.length) {
                const rewardsToAssign = rewards.filter(r => r.level <= newLevel)

                rewardsToAssign.forEach(reward => {
                    if (!member.roles.cache.find(r => r.id == reward.roleID)) {
                        member.roles.add(reward.roleID)
                            .catch()
                    }
                })
            }
            resolve()

        })
    }

    /**
     * 
     * @param {User|GuildMember} user The user you want to get the xp of
     * @param {Guild} guild The guild the user is in
     */
    async getUserXP(user, guild) {
        if (user instanceof User) {
            user = user.id
        } else if (user instanceof GuildMember) {
            user = user.member.id
        }
        const foundXP = await XP.findOne({
            userID: user,
            guildID: guild.id
        })

        if (!foundXP) {
            throw new Error("No user found!")
        }

        const returnValue = {
            level: foundXP.level,
            xp: foundXP.xp,
            card: {
                rank: await XP.getRank(foundXP),
                neededXP: this.calculateRequiredXP(foundXP.xp)
            }
        }

        return returnValue
    }

    calculateLevel(xp) {
        return Math.floor(0.1 * Math.sqrt(xp))
    }

    /**
     * Calculates required XP to level up
     * @param {Number} xp Current XP of user
     */
    calculateRequiredXP(xp) {
        let currentLevel = this.calculateLevel(xp)

        const nextLevel = this.calculateLevel(xp) + 1

        let neededXP = 0
        while (currentLevel < nextLevel) {
            neededXP++
            currentLevel = this.calculateLevel(xp + neededXP)
        }
        return neededXP;
    }

    /**
     * Calculates the amount of xp that a level requires.
     * @param {Number} level The current level
     */
    calculateXPForLevel = (level) => {
        let xp = 0
        let currentLevel = 0

        while (currentLevel != level) {
            xp++
            currentLevel = calculateLevel(xp)
        }
        return xp;
    }
}

module.exports = CrackheadXP